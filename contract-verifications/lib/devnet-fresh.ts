import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

execSync(
  `tenderly devnet spawn-rpc --project ${process.argv[2]} --template ${process.argv[3]} 2>.devnet`
);

const devnet = readFileSync(".devnet").toString().trim();

const hardhatConfig = readFileSync("hardhat.config.ts").toString();
const fresh = hardhatConfig.replace(
  /^(\s+url:\s+)"(.*?)",/gm,
  `      url: "${devnet}",`
);
console.log("Updating hardhat.config.ts with the new devnet rpc", devnet);
writeFileSync("hardhat.config.ts", fresh);
