// File: scripts/greeter/automatic.ts
import { Wallet } from "ethers";
import { ethers } from "hardhat";

async function main() {
  const owners = (await ethers.provider.listAccounts()).slice(0, 3);

  const multisigWalletFactory = await ethers.getContractFactory(
    "MultiSigWallet"
  );
  const mutltisigWallet = multisigWalletFactory.attach(
    "0xff39a3e734fe363e631441f6d24c7539240c2628"
  );

  console.log(owners);
  console.log(await mutltisigWallet.getOwners());

  // TODO: How to fund a multisig wallet?
  const funder = ethers.provider.getSigner(0);

  console.log("Submitting TX to Multisig");
  await mutltisigWallet
    .connect(funder)
    .submitTransaction(
      "0x6748D7261E35b479994d52bBBf098BB1550d11C0",
      100000,
      "0x"
    );
  //TODO: where do we keep the money???
  console.log("Submitted!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
