import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

const [tenderlyProject, devnetTemplate, chainId] = process.argv.slice(2);
if (!tenderlyProject && !devnetTemplate && !chainId) {
  console.error(
    "Must specify tenderly-project-slug and devnet-template-slug devnet-chain-id\nBe sure to copy the right chainId from devnet template"
  );
  process.exit(1);
}

execSync(
  `tenderly devnet spawn-rpc --project ${tenderlyProject} --template ${devnetTemplate} 2>.devnet`
);

const devnet = readFileSync(".devnet").toString().trim();

const env = readFileSync(".env")
  .toString()
  .replace(/TENDERLY_DEVNET_URL=(.*)/g, `TENDERLY_DEVNET_URL=${devnet}`)
  .replace(/TENDERLY_DEVNET_CHAIN_ID=(.*)/g, `TENDERLY_DEVNET_CHAIN_ID=${chainId}`);

writeFileSync(".env", env);

const hardhatConfig = readFileSync("hardhat.config.ts").toString();
const devnetized = hardhatConfig.replace(
  /^(\s+url:\s+)"(.*?)",/gm,
  `      url: "${devnet}",`
).replace(/^(\s+chainId:\s+)(\d+),/gm,
`      chainId: ${chainId},`)

console.log("Updating hardhat.config.ts with the new devnet rpc", devnet);

writeFileSync("hardhat.config.ts", devnetized);
