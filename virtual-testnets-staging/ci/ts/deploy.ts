import { execSync } from "child_process";
import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

function checkFoundryRepoClean() {
  const foundryRepo = process.env.FOUNDRY_REPO!;
  if (!fs.existsSync(foundryRepo)) {
    console.error("Foundry repo not found");
    process.exit(1);
  }
  try {
    execSync(`cd ${foundryRepo} && git diff --quiet -- foundry.toml`);
  } catch {
    console.error("Commit or clear changes from foundry.toml");
    process.exit(1);
  }
}

/**
 * Fetch the chain ID when setting up Foundry
 */
export async function fetchChainId(rpcUrl: string) {
  try {
    const response = await axios.post(rpcUrl, {
      jsonrpc: "2.0",
      id: 0,
      method: "eth_chainId",
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const chainIdHex = response.data.result;
    const chainId = parseInt(chainIdHex, 16);
    console.log(`Chain ID: ${chainId}`);
    return chainId;
  } catch (error) {
    console.error("Failed to fetch Chain ID");
    throw error;
  }
}

/**
 * Runs `deployCommands` after setting up foundry for verification.
 * The `foundry,toml` should never be persisted with TENDERLY_ACCESS_KEY.
 *
 * @param deployCommands a function running foundry creates
 */
export async function runDeploy(deployCommands: () => Promise<void>) {
  checkFoundryRepoClean();
  let rpcUrl = process.env.TENDERLY_VIRTUAL_TESTNET_PUBLIC_RPC!;
  const chainId = await fetchChainId(rpcUrl);

  let foundryRepo = process.env.FOUNDRY_REPO!;
  const foundryTomlPath = `${foundryRepo}/foundry.toml`;
  const etherscanConfig = `
[etherscan]
unknown_chain = { key = "${process.env.TENDERLY_ACCESS_KEY!}", chain = ${chainId}, url = "${rpcUrl}/verify/etherscan" }
`;
  fs.appendFileSync(foundryTomlPath, etherscanConfig);
  await deployCommands();
  console.log("PWD1", execSync("PWD").toString());
  execSync(`cd ${foundryRepo} && git checkout -- foundry.toml`);
  console.log("PWD2", execSync("PWD").toString());
}