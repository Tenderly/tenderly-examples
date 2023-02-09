import "@tenderly/hardhat-tenderly";
import { expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ethers, tenderly } from "hardhat";
import { MultiSigWallet, TicTacToe } from "../typechain-types";

describe("TicTacToe", () => {
  let playerAddresses: string[] = [];
  let players: Signer[] = [];
  let ticTacToe: TicTacToe | null = null;

  before(async () => {
    // accounts setup
    playerAddresses = (await ethers.provider.listAccounts()).slice(0, 3);
    players = playerAddresses.map(ethers.provider.getSigner);

    // deploying the contract
    const ticTacToeFactory = await ethers.getContractFactory("TicTacToe");

    console.log("Deploying Tic Tac Toe...");
    ticTacToe = await ticTacToeFactory.deploy();

    await ticTacToe.deployed();

    // verify in Tenderly (fork)
    await tenderly.verify({
      name: "TicTacToe",
      address: ticTacToe.address,
    });

    console.log("Deployed to:", ticTacToe.address);

    console.log("MS wallet funded");
  });
});
