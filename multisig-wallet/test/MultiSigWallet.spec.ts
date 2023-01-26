import "@tenderly/hardhat-tenderly";
import { expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ethers, tenderly } from "hardhat";
import { MultiSigWallet } from "../typechain-types";

describe("Multisig wallet", () => {
  let ownerAddresses: string[] = [];
  let multisigWallet: MultiSigWallet | null = null;
  let signers: Signer[] = [];

  let nonOwnerAddress = "0x0000000000000000000000000000000000000000";
  let nonOwnerSigner = ethers.provider.getSigner(nonOwnerAddress);
  const recipientAddress = "0x499dbDC462f19BaD8b178C235eA3605aF5D65Dd7";

  before(async () => {
    // accounts setup
    ownerAddresses = (await ethers.provider.listAccounts()).slice(0, 3);
    signers = ownerAddresses.map(ethers.provider.getSigner);

    nonOwnerAddress = (await ethers.provider.listAccounts())[9];
    nonOwnerSigner = ethers.provider.getSigner(nonOwnerAddress);

    // deploying the contract
    const multisigWalletFactory = await ethers.getContractFactory(
      "MultiSigWallet"
    );

    console.log("Deploying MultiSigWallet...");
    multisigWallet = await multisigWalletFactory.deploy(ownerAddresses, 2);

    await multisigWallet.deployed();

    // verify in Tenderly (fork)
    await tenderly.verify({
      name: "MultiSigWallet",
      address: multisigWallet.address,
    });

    console.log("Deployed to:", multisigWallet.address);

    // Fund the contract with 1 ETH
    const fnd = await signers[0].sendTransaction({
      to: multisigWallet.address,
      value: parseEther("1.0"),
    });
    await fnd.wait();

    console.log("MS wallet funded");
  });

  it("accepts submit from owners", async () => {
    await expect(
      multisigWallet
        ?.connect(signers[0])
        .submitTransaction(recipientAddress, 1000, "0x")
    )
      .to.emit(multisigWallet, "SubmitTransaction")
      .withArgs(
        ownerAddresses[0],
        BigNumber.from(0),
        recipientAddress,
        BigNumber.from(1000),
        "0x"
      );
  });

  it("rejects submit from non-owner", async () => {
    await expect(
      multisigWallet
        ?.connect(nonOwnerSigner)
        .submitTransaction(recipientAddress, 0, "0x", { gasLimit: 100000 })
    ).to.be.reverted;
  });

  it("accepts confirmation from owners", async () => {
    const submissionTransaction = await multisigWallet
      ?.connect(signers[0])
      .submitTransaction(recipientAddress, 1000, "0x");
    const submissionReceipt = await submissionTransaction?.wait();

    const submissionEvent = submissionReceipt?.events?.filter(
      (e) => e.event == "SubmitTransaction"
    );
    // @ts-ignore
    const latestTx = (submissionEvent[0].args[1] as BigNumber).toNumber();

    await expect(
      multisigWallet?.connect(signers[0]).confirmTransaction(latestTx)
    )
      .to.emit(multisigWallet, "ConfirmTransaction")
      .withArgs(ownerAddresses[0], latestTx);

    await expect(
      multisigWallet?.connect(signers[1]).confirmTransaction(latestTx)
    )
      .to.emit(multisigWallet, "ConfirmTransaction")
      .withArgs(ownerAddresses[1], latestTx);
  });

  it("rejects confirmation from non-owners", async () => {
    multisigWallet
      ?.connect(signers[0])
      // TODO is gasLimit the way to make ethers send the TX?
      .submitTransaction(recipientAddress, 1000, "0x");

    await expect(
      multisigWallet
        ?.connect(nonOwnerSigner)
        .confirmTransaction(0, { gasLimit: 100000 })
    ).to.be.reverted;
  });

  it("rejects execution with insufficient approval number", async () => {
    const submission = await multisigWallet
      ?.connect(signers[0])
      .submitTransaction(recipientAddress, 1000, "0x");
    const submissionReceipt = await submission?.wait();

    const submissionEvent = submissionReceipt?.events?.filter(
      (e) => e.event == "SubmitTransaction"
    );
    // @ts-ignore
    const latestTx = (submissionEvent[0].args[1] as BigNumber).toNumber();

    await multisigWallet?.connect(signers[1]).confirmTransaction(latestTx);

    await expect(
      multisigWallet
        ?.connect(signers[2])
        .executeTransaction(latestTx, { gasLimit: 100000 })
    ).to.be.reverted;
  });

  it("accepts execution with required approval number", async () => {
    const submissionTransaction = await multisigWallet
      ?.connect(signers[0])
      .submitTransaction(recipientAddress, 1000, "0x");
    const submissionReceipt = await submissionTransaction?.wait();

    const submissionEvent = submissionReceipt?.events?.filter(
      (e) => e.event == "SubmitTransaction"
    );
    // @ts-ignore
    const latestTx = (submissionEvent[0].args[1] as BigNumber).toNumber();

    await multisigWallet?.connect(signers[0]).confirmTransaction(latestTx);

    await multisigWallet?.connect(signers[1]).confirmTransaction(latestTx);

    await expect(
      multisigWallet
        ?.connect(signers[2])
        .executeTransaction(latestTx, { gasLimit: 100000 })
    )
      .to.emit(multisigWallet, "ExecuteTransaction")
      .withArgs(ownerAddresses[2], latestTx);
  });
});
