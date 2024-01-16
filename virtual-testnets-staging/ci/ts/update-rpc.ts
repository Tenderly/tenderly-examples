import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

function updateTenderlyConfig(testnetRpc: string, libDir: string = ".", deploymentsDir: string = process.env.DEPLOYMENTS_DIR!) {
  // Extract the UUID from the testnet RPC URL
  const testnetRpcUuid = testnetRpc.replace("https://virtual.mainnet.rpc.tenderly.co/", "");

  // Read the template JSON file
  const templatePath = path.join(libDir, "tenderly.config.template.json");
  const templateContent = fs.readFileSync(templatePath, "utf8");

  // Replace placeholders in the JSON template
  const updatedContent = templateContent
    .replace(/(https:\/\/virtual\.mainnet\.rpc\.tenderly\.co\/)(.*)(["|'])(.*)/g, `$1${testnetRpcUuid}$3$4`)
    .replace(/(https:\/\/dashboard\.tenderly\.co\/explorer\/vnet\/)(.*)(["|'])(.*)/g, `$1${testnetRpcUuid}$3$4`);

  // Write the updated JSON to the deployments directory
  const outputPath = path.join(deploymentsDir, "tenderly.config.json");
  fs.writeFileSync(outputPath, updatedContent, "utf8");

  console.log("Configuration saved at tenderly.config.json");
}

// Example usage
const TESTNET_RPC = process.argv[2]; // Expecting TESTNET_RPC as the first command line argument
if (!TESTNET_RPC) {
  console.error("Please provide the TESTNET_RPC URL as an argument.");
  process.exit(1);
}