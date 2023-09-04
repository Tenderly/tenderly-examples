import { runDeploy } from "./deploy";
import {
  forgeCreateAndVerify,
  forgeCreateTenderly,
  fundDeployer,
  joinAllDeployments,
  resetDeployments,
} from "./deployment-utils";
import dotenv from "dotenv";
import { updateTenderlyConfig } from "./rpc-config";

// Load environment variables
dotenv.config();
runDeploy(async () => {
  const conf = {
    DEPLOYMENTS_DIR: process.env.DEPLOYMENTS_DIR!,
    CHAIN_ID: process.env.CHAIN_ID!,
    TENDERLY_VIRTUAL_TESTNET_PUBLIC_RPC: process.env.TENDERLY_VIRTUAL_TESTNET_PUBLIC_RPC!,
    PRIVATE_KEY: process.env.PRIVATE_KEY!,
    TENDERLY_VIRTUAL_TESTNET_VERIFIER_URL: process.env.TENDERLY_VIRTUAL_TESTNET_VERIFIER_URL!,
    TENDERLY_ACCESS_KEY: process.env.TENDERLY_ACCESS_KEY!,
    RPC_URL: process.env.RPC_URL!,
    DEPLOYER_ADDRESS: process.env.DEPLOYER_ADDRESS!,
    FOUNDRY_REPO: process.env.FOUNDRY_REPO!,
  };

  await fundDeployer();
  await resetDeployments();

  await forgeCreateAndVerify("Counter");
  await forgeCreateAndVerify("Lock", "--constructor-args 1000000000000000000000");

  await joinAllDeployments();
  await updateTenderlyConfig(process.env.TENDERLY_VIRTUAL_TESTNET_PUBLIC_RPC!);
}).then(() => {
  console.log("Deployment complete");
}).catch((e) => {
  console.error("Deployment failed");
  throw e;
});