import { ethers } from "hardhat";
import { Deployments } from "./constants";

async function main() {
  const owners = (await ethers.provider.listAccounts()).slice(0, 3);

  console.log("Fund multisig");
  const fundingReciept = await ethers.provider
    .getSigner(owners[0])
    .sendTransaction({
      to: Deployments.MultisigWallet,
      value: ethers.utils.parseUnits("0.01", "ether"),
    });

  await fundingReciept.wait();
}

main().catch((error) => {
  console.error(error, JSON.stringify(error));
  process.exitCode = 1;
});
