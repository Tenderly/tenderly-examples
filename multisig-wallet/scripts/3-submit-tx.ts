import { ethers } from "hardhat";
import { Deployments } from "./constants";

async function main() {
  const owners = (await ethers.provider.listAccounts()).slice(0, 3);

  const multisigWalletFactory = await ethers.getContractFactory(
    "MultiSigWallet"
  );
  const multisigWallet = multisigWalletFactory.attach(
    Deployments.MultisigWallet
  );

  console.log(owners);
  console.log(await multisigWallet.getOwners());

  const funder = ethers.provider.getSigner(0);

  console.log("Submitting TX to Multisig");
  // this TX only sends some funds to the multisig
  const submitReceipt = await multisigWallet
    .connect(funder)
    .submitTransaction(
      "0x6748D7261E35b479994d52bBBf098BB1550d11C0",
      100000,
      "0x"
    );

  await submitReceipt.wait();
  console.log("Submitted!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
