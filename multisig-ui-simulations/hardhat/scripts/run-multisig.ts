// File: scripts/greeter/automatic.ts
import { ethers, network } from "hardhat";
import { findDeployment } from "../lib-tenderly/deployment-utils";

async function main() {
  const multisigWalletFactory = await ethers.getContractFactory(
    "MultiSigWallet"
  );
  const deployment = findDeployment("MultiSigWallet", network.name);
  if (!deployment) {
    console.log("We have an error");
    return;
  }
  const mutltisigWallet = multisigWalletFactory.attach(
    "0xFF39a3E734fE363E631441F6D24C7539240C2628"
  );

  console.log("Approving TX 1/2");
  const confirmation1 = await mutltisigWallet
    .connect(ethers.provider.getSigner(0))
    .confirmTransaction(0);
  console.log("Approving TX 2/2");
  const confirmation2 = await mutltisigWallet
    .connect(ethers.provider.getSigner(1))
    .confirmTransaction(0);

  console.log("Confirmation mined 1/2");
  await confirmation1.wait();
  console.log("Confirmation mined 2/2");
  await confirmation2.wait();

  console.log("Executing TX");
  const confirmation = await mutltisigWallet.executeTransaction(0, {
    gasLimit: 1000000,
  });
  await confirmation.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
