import * as fs from "fs";
import { execSync } from "child_process";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const DEPLOYMENTS_DIR = process.env.DEPLOYMENTS_DIR!;
const CHAIN_ID = process.env.CHAIN_ID!;
const TENDERLY_VIRTUAL_TESTNET_PUBLIC_RPC = process.env.TENDERLY_VIRTUAL_TESTNET_PUBLIC_RPC!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const TENDERLY_VIRTUAL_TESTNET_VERIFIER_URL = process.env.TENDERLY_VIRTUAL_TESTNET_VERIFIER_URL!;
const TENDERLY_ACCESS_KEY = process.env.TENDERLY_ACCESS_KEY!;
const DEPLOYER_ADDRESS = process.env.DEPLOYER_ADDRESS!;
const FOUNDRY_REPO = process.env.FOUNDRY_REPO!;

export async function resetDeployments() {
  if (fs.existsSync(DEPLOYMENTS_DIR)) {
    fs.rmSync(DEPLOYMENTS_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DEPLOYMENTS_DIR, { recursive: true });
}

export async function forgeCreateTenderly(contractName: string, additionalArgs: string = ""): Promise<`0x${string}`> {
  const deploymentFile = `${contractName}@${CHAIN_ID}.json`;
  console.log(`Deploying ${contractName} @ ${CHAIN_ID}`);
  const command = `cd ${FOUNDRY_REPO} && forge create ${contractName} ${additionalArgs} --rpc-url ${TENDERLY_VIRTUAL_TESTNET_PUBLIC_RPC} --private-key ${PRIVATE_KEY} --json`;
  console.log(`Deploy Command\n ${command}`);
  const createOut = execSync(command).toString();
  fs.writeFileSync(`${DEPLOYMENTS_DIR}/${deploymentFile}`, createOut);
  let creationInfo = JSON.parse(createOut);
  console.log("Create complete:\n", creationInfo.toString());
  return (creationInfo.deployedTo);
}

export async function forgeCreateAndVerify(contractName: string, additionalArgs: string = "") {
  let address = await forgeCreateTenderly(contractName, additionalArgs);
  const command = `cd ${FOUNDRY_REPO} && forge verify-contract ${address} ${contractName} --verifier-url ${TENDERLY_VIRTUAL_TESTNET_VERIFIER_URL} --etherscan-api-key ${TENDERLY_ACCESS_KEY}`;
  console.log("Verify command\n " + command);
  const verifyOut = execSync(command).toString();
  console.log("Verification out:\n ", verifyOut);
}

export async function joinAllDeployments() {
  console.log("Joining deployment info", DEPLOYMENTS_DIR);
  console.log(">>>", execSync("PWD").toString());
  const deploymentFiles = fs.readdirSync(DEPLOYMENTS_DIR).filter(file => file.endsWith(".json"));

  let result: any = {};
  deploymentFiles.forEach(file => {
    if (file.indexOf("@") == -1) {
      return;
    }
    const [contractName, chainId] = file.split(".")[0].split("@");
    const fileContent = JSON.parse(fs.readFileSync(`${DEPLOYMENTS_DIR}/${file}`).toString());
    result = {
      ...result, [contractName]: {
        [chainId]: {
          address: fileContent.deployedTo,
          transactionHash: fileContent.transactionHash,
          deployer: fileContent.deployer,
        },
      },
    };
  });
  console.log("Completed deployments", JSON.stringify(result, null, 2));

  Object.keys(result).forEach(contract => {
    result[contract].abi = JSON.parse(fs.readFileSync(`${FOUNDRY_REPO}/out/${contract}.sol/${contract}.json`).toString()).abi;
  });

  fs.writeFileSync(`${DEPLOYMENTS_DIR}/deployments.json`, JSON.stringify(result, null, 2));
}

export async function fundDeployer() {
  const setBalancePayload = {
    jsonrpc: "2.0",
    method: "tenderly_setBalance",
    params: [
      DEPLOYER_ADDRESS,
      "0xDE0B6B3A7640000", // 10^18 wei
    ],
    id: "1234",
  };

  await axios.post(TENDERLY_VIRTUAL_TESTNET_PUBLIC_RPC, setBalancePayload, { headers: { "Content-Type": "application/json" } })
    .then(response => console.log(response.data))
    .catch(error => console.error("Failed to fund deployer:", error));
}