import { existsSync, readFileSync, write, writeFileSync } from "fs";
import { TenderlyForkProvider } from "./api/tenderly-api";

export type TenderlyInfra = {
  fork?: {
    name: string;
    forkId: string;
    url: string;
    networkId: number;
    chainId: number;
  };
};

export const loadInfra = () => {
  if (!existsSync(".tenderly/infra.json")) {
    return {};
  }
  return JSON.parse(
    readFileSync(".tenderly/infra.json").toString() || "{}"
  ) as unknown as TenderlyInfra;
};

export const replaceExistingForkwWith = (fork: TenderlyForkProvider) => {
  const forkUrl = `https://rpc.tenderly.co/fork/${fork.id}`;

  writeFileSync(
    "../front/.env",
    readFileSync("../front/.env")
      .toString()
      .replace(/VITE_FORK_RPC=.*/, `VITE_FORK_RPC=${forkUrl}`)
  );

  const forkMode = process.env.FORK_MODE || "FORK";

  let configKey = "TENDERLY_FORK_URL";
  switch (forkMode) {
    case "TEST":
      configKey = "TENDERLY_TEST_FORK_URL";
      break;
  }

  const env = readFileSync(".env").toString();
  const newEnv = env
    .split("\n")
    .map((line) => {
      if (line.startsWith(`${configKey}=`)) {
        return `${configKey}=${forkUrl}`;
      }
      return line;
    })
    .map((line) => {
      if (line.startsWith("TENDERLY_FORK_CHAINID=")) {
        return `TENDERLY_FORK_CHAINID=${fork.chainId}`;
      }
      return line;
    })
    .join("\n");
  writeFileSync(".env", newEnv);

  // console.log("NEW ENV", newEnv);
  writeFileSync("deployments.json", JSON.stringify({ latest: [] }, null, 2));
};
