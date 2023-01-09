import { ethers, tenderly } from "hardhat";

async function main() {
  const owners = (await ethers.provider.listAccounts()).slice(0, 3);

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
}

main().catch((error) => {
  console.error(error, JSON.stringify(error));
  process.exitCode = 1;
});
