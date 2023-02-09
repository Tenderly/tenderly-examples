// File: scripts/greeter/automatic.ts
import { Signer } from "ethers";
import { ethers, network } from "hardhat";
import { findDeployment } from "../lib-tenderly/deployment-utils";

async function main() {
  const ticTacToeC = await ethers.getContractFactory("TicTacToe");
  const deployment = findDeployment("TicTacToe", network.name) || {
    address: "0x764ce61a1a6e90d0b7bc0c9e8938c733dbb378ef",
  };

  if (!deployment) {
    console.log("We have an error");
    return;
  }
  const ticTacToe = ticTacToeC.attach(deployment.address);
  const [player1, player2] = (await ethers.provider.listAccounts())
    .slice(0, 2)
    .map(ethers.provider.getSigner);

  await ticTacToe.newGame();
  await ticTacToe.connect(player1).joinGame(1);
  await ticTacToe.connect(player2).joinGame(1);
  await ticTacToe.connect(player1).makeMove(1, 0, 0);
  await ticTacToe.connect(player2).makeMove(1, 2, 0);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
