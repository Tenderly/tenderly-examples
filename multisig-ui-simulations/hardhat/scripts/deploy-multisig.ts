// File: scripts/greeter/automatic.ts
import { ethers, network, tenderly } from "hardhat";
import { deployed } from "../lib-tenderly/deployment-utils";
import { readFileSync, writeFileSync } from "fs";

async function main() {
  const owners = (await ethers.provider.listAccounts()).slice(0, 3);

  const multisigWalletFactory = await ethers.getContractFactory(
    "MultiSigWallet"
  );

  console.log("Deploying MultiSigWallet...", owners);
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

  deployed({
    address: multisigWallet.address,
    name: "MultiSigWallet",
    network: network.name,
  });

  console.log("Deployed to:", multisigWallet.address);

  let uiEnv = readFileSync("../front/.env").toString();
  uiEnv = uiEnv.replace(
    /VITE_MULTISIG_WALLET=.*\n/,
    `VITE_MULTISIG_WALLET=${multisigWallet.address.toLowerCase()}\n`
  );
  console.log(uiEnv);

  writeFileSync("../front/.env", uiEnv);

  console.log("Fund multisig");
  const fundingReciept = await ethers.provider
    .getSigner(owners[0])
    .sendTransaction({
      to: multisigWallet.address,
      value: ethers.utils.parseUnits("0.01", "ether"),
    });

  await fundingReciept.wait();
}

main().catch((error) => {
  console.error(error, JSON.stringify(error));
  process.exitCode = 1;
});
