// File: scripts/greeter/automatic.ts
import { ethers, network, tenderly } from "hardhat";
import { deployed } from "../lib-tenderly/deployment-utils";
import { readFileSync, writeFileSync } from "fs";

async function main() {
  const owners = (await ethers.provider.listAccounts()).slice(0, 3);

  const ticTacToeFactory = await ethers.getContractFactory("TicTacToe");

  console.log("Deploying TicTacToe...");
  const ticTacToe = await ticTacToeFactory.deploy();
  console.log(ticTacToe.address);
  await ticTacToe.deployed();

  console.log("Verifying contract (deployed at " + ticTacToe.address + ")");
  await tenderly.verify({
    name: "TicTacToe",
    address: ticTacToe.address,
  });

  deployed({
    address: ticTacToe.address,
    name: "TicTacToe",
    network: network.name,
  });

  let uiEnv = readFileSync("../front/.env").toString();
  uiEnv = uiEnv.replace(
    /VITE_TIC_TAC_TOE=.*\n/g,
    `VITE_TIC_TAC_TOE=${ticTacToe.address.toLowerCase()}\n`
  );
  console.log(uiEnv);

  writeFileSync("../front/.env", uiEnv);

  console.log("Deployed to:", ticTacToe.address);
}

main().catch((error) => {
  console.error(error, JSON.stringify(error));
  process.exitCode = 1;
});
