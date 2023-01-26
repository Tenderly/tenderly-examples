import { ethers } from "hardhat";
import { Deployments } from "./constants";

async function main() {
  const multisigWalletFactory = await ethers.getContractFactory(
    "MultiSigWallet"
  );

  const multisigWallet = multisigWalletFactory.attach(
    Deployments.MultisigWallet
  );

  console.log("Approving TX 1/2");
  const confirmation1 = await multisigWallet
    .connect(ethers.provider.getSigner(0))
    .confirmTransaction(0, { gasLimit: 100000 });

  console.log("Approving TX 2/2");
  const confirmation2 = await multisigWallet
    .connect(ethers.provider.getSigner(1))
    .confirmTransaction(0);

  console.log("Confirmation mined 1/2");
  await confirmation1.wait();
  console.log("Confirmation mined 2/2");
  await confirmation2.wait();

  console.log(multisigWallet.getTransaction(0));

  console.log("Executing TX");
  const confirmation = await multisigWallet.executeTransaction(0, {
    gasLimit: 1000000,
  });
  await confirmation.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
