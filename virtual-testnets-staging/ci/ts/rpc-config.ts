import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { readFileSync } from "fs";
import { fetchChainId } from "./deploy";
import { execSync } from "child_process";
import { existsSync } from "node:fs";

dotenv.config();
const deploymentsDir = process.env.DEPLOYMENTS_DIR!;

export async function updateTenderlyConfig(testnetRpc: string) {
  // Extract the UUID from the testnet RPC URL
  const testnetRpcUuid = testnetRpc.replace("https://virtual.mainnet.rpc.tenderly.co/", "");
  console.log("PWD", execSync("PWD").toString());
  // Read the template JSON file
  const templatePath = "tenderly.config.template.json";
  const templateContent = fs.readFileSync(templatePath, "utf8");

  // Replace placeholders in the JSON template
  const chainConfig = templateContent
    .replace(/(https:\/\/virtual\.mainnet\.rpc\.tenderly\.co\/)(.*)(["|'])(.*)/g, `$1${testnetRpcUuid}$3$4`)
    .replace(/(https:\/\/dashboard\.tenderly\.co\/explorer\/vnet\/)(.*)(["|'])(.*)/g, `$1${testnetRpcUuid}$3$4`);

  // Write the updated JSON to the deployments directory
  const outputPath = path.join(deploymentsDir, "tenderly.config.json");
  const multiChainConfig = existsSync(outputPath) ? JSON.parse(readFileSync(outputPath).toString()) : {};
  console.log(chainConfig);
  multiChainConfig[await fetchChainId(testnetRpc)] = JSON.parse(chainConfig);

  fs.writeFileSync(outputPath, JSON.stringify(multiChainConfig, null, 2), "utf8");

  console.log("Configuration saved at tenderly.config.json");
}
