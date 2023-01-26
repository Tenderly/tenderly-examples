import { ethers, tenderly } from "hardhat";

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

  console.log("Approving TX 1/2");
  const confirm1Tx = await multisigWallet
    .connect(ethers.provider.getSigner(0))
    .confirmTransaction(0, { gasLimit: 100000 });

  console.log("Approving TX 2/2");
  const confirm2Tx = await multisigWallet
    .connect(ethers.provider.getSigner(1))
    .confirmTransaction(0);

  console.log("Confirmation mined 1/2");
  await confirm1Tx.wait();

  console.log("Confirmation mined 2/2");
  await confirm2Tx.wait();

  console.log("Executing TX");
  const executionTx = await multisigWallet.executeTransaction(0, {
    gasLimit: 1000000,
  });
  await executionTx.wait();
}

main().catch((error) => {
  console.error(error, JSON.stringify(error));
  process.exitCode = 1;
});
