import axios from "axios";
import * as env from "dotenv";

import { ethers } from "hardhat";
import { Deployments } from "./constants";
env.config();

const { TENDERLY_USERNAME, TENDERLY_PROJECT_SLUG, TENDERLY_ACCESS_KEY } =
  process.env;

async function main() {
  const multisigWalletFactory = await ethers.getContractFactory(
    "MultiSigWallet"
  );

  const multisigWallet = multisigWalletFactory.attach(
    Deployments.MultisigWallet
  );

  const txIndex = 1;

  const executionTx =
    await multisigWallet.populateTransaction.executeTransaction(txIndex, {
      gasLimit: 1000000,
    });

  executionTx.from = (await ethers.provider.listAccounts())[0];

  console.log(JSON.stringify(executionTx));
  const simulationRequest = {
    save: true,
    ...executionTx,
    network_id: "11155111",
    simulation_type: "full",
    input: executionTx.data,
    state_objects: {
      [multisigWallet.address]: {
        storage: getStorageOverride(txIndex),
      },
    },
  };

  const sim = await axios.post(
    `https://api.tenderly.co/api/v1/account/${TENDERLY_USERNAME}/project/${TENDERLY_PROJECT_SLUG}/simulate`,
    simulationRequest,
    {
      headers: {
        "X-Access-Key": TENDERLY_ACCESS_KEY as string,
      },
    }
  );
  // console.log(JSON.stringify(sim.data, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/**
 *
 * @param txIndex The TX index in Multisig (we want to plant it's got 2 approvals)
 * @returns An override object: storage slot -> override value
 */
function getStorageOverride(txIndex: number) {
  // storage slot of the `transactions` array
  const transactionsArraySlot = ethers.utils.keccak256(
    ethers.utils.hexZeroPad("0x4", 32)
  );

  /*
    Solidity:
      struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        uint8 numConfirmations;
    }

    Size: 4 slots
  */

  // The offset of the `txIndex`-th element in `transactions` array
  const elementOffset = ethers.BigNumber.from(txIndex.toString()).mul(
    ethers.BigNumber.from("4")
  );

  const txNumConfirmationStorageLocation = ethers.BigNumber.from(
    transactionsArraySlot
  )
    .add(elementOffset) // offset of the `txIndex`-th element in `transactions` array
    .add("3") // the filed `numOfConfirmations` is in the slot 3 (packed with the `executed` field)
    .toHexString();

  console.log("numberOfConfirmations at", txNumConfirmationStorageLocation);
  return {
    // lower byte (00) goes into `executed` field
    // upper byte (02) goes into `numConfirmations` field
    [txNumConfirmationStorageLocation]: ethers.utils.hexZeroPad("0x0200", 32),
  };
}
