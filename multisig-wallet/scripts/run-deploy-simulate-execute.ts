import axios from "axios";
import * as env from "dotenv";
import { ethers, tenderly } from "hardhat";
env.config();

const { TENDERLY_USER, TENDERLY_PROJECT } = process.env;

async function main() {
  const owners = (await ethers.provider.listAccounts()).slice(0, 3);
  console.log(owners);

  const multisigWalletFactory = await ethers.getContractFactory(
    "MultiSigWallet"
  );

  console.log("Deploying MultiSigWallet...");

  const multisigWallet = await multisigWalletFactory.deploy(owners, 2);
  console.log(multisigWallet.address);
  await multisigWallet.deployed();

  console.log(
    "Verifying multisig wallet (deployed at " + multisigWallet.address + ")"
  );

  await tenderly.verify({
    name: "MultiSigWallet",
    address: multisigWallet.address,
  });
  console.log("Deployed to:", multisigWallet.address);

  console.log(
    "Place the address to scripts/constants.ts under `MultisigWallet`"
  );

  console.log("Fund multisig");
  const fundingReciept = await ethers.provider
    .getSigner(owners[0])
    .sendTransaction({
      to: multisigWallet.address,
      value: ethers.utils.parseUnits("0.01", "ether"),
    });

  await fundingReciept.wait();

  console.log("Submitting TX to Multisig");
  // this TX only sends some funds to the multisig
  const submitTransaction = await multisigWallet
    .connect(ethers.provider.getSigner(0))
    .submitTransaction((await ethers.provider.listAccounts())[3], 100000, "0x");

  await submitTransaction.wait();

  console.log("Submitted tx!");

  console.log("Executing TX");
  const executionTx =
    await multisigWallet.populateTransaction.executeTransaction(0, {
      gasLimit: 1000000,
    });

  axios.post(
    `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/simulate`,
    {},
    {
      headers: {
        // TODO: Tenderly Headers
      },
    }
  );
}

main().catch((error) => {
  console.error(error, JSON.stringify(error));
  process.exitCode = 1;
});
