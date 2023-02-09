import { JsonRpcProvider } from "@ethersproject/providers";
import axios, { AxiosResponse } from "axios";
import * as dotenv from "dotenv";

dotenv.config();

type TenderlyForkRequest = {
  block_number?: number;
  network_id: string;
  transaction_index?: number;
  initial_balance?: number;
  alias?: string;
  description?: string;
  chain_config?: {
    chain_id?: number;
    homestead_block?: number;
    dao_fork_support?: boolean;
    eip_150_block?: number;
    eip_150_hash?: string;
    eip_155_block?: number;
    eip_158_block?: number;
    byzantium_block?: number;
    constantinople_block?: number;
    petersburg_block?: number;
    istanbul_block?: number;
    berlin_block?: number;
  };
};

export type TenderlyForkProvider = {
  provider: JsonRpcProvider;
  id: number;
  blockNumber: number;
  chainId: number;
  networkId: number;
  /**
   * map from address to given address' balance
   */
  removeFork: () => Promise<AxiosResponse<any, any>>;
};

const somewhereInTenderly = (
  where: string = process.env.TENDERLY_PROJECT_SLUG || ""
) =>
  axios.create({
    baseURL: `https://api.tenderly.co/api/v1/${where}`,
    headers: {
      "X-Access-Key": process.env.TENDERLY_ACCESS_KEY || "",
      "Content-Type": "application/json",
    },
  });

export const inProject = (...path: any[]) =>
  [
    `account/${process.env.TENDERLY_USERNAME}/project/${process.env.TENDERLY_PROJECT_SLUG}`,
    ...path,
  ]
    .join("/")
    .replace("//", "");

export const anAxiosOnTenderly = () => somewhereInTenderly("");
const axiosOnTenderly = anAxiosOnTenderly();

// todo: cache these poor axioses
const axiosInProject = somewhereInTenderly(inProject());

export const removeFork = async (forkId: string) => {
  console.log("Removing test fork", forkId);
  return await axiosOnTenderly.delete(inProject(`fork/${forkId}`));
};

export async function aTenderlyFork(
  fork: TenderlyForkRequest
): Promise<TenderlyForkProvider> {
  const forkResponse = await axiosInProject.post(`/fork`, fork);
  const forkId = forkResponse.data.root_transaction.fork_id;

  const forkRpc = `https://rpc.tenderly.co/fork/${forkId}`;
  const forkProvider = new JsonRpcProvider(forkRpc);

  const blockNumberStr = (
    forkResponse.data.root_transaction.receipt.blockNumber as string
  ).replace("0x", "");
  const blockNumber: number = Number.parseInt(blockNumberStr, 16);

  console.info(
    `\nForked with fork id ${forkId} at block number ${blockNumber}`
  );

  console.info(`https://dashboard.tenderly.co/${inProject("fork", forkId)}`);
  console.info("JSON-RPC:", forkRpc);

  return {
    provider: forkProvider,
    blockNumber,
    id: forkId,
    removeFork: () => removeFork(forkId),
    networkId: fork.network_id as any,
    chainId: forkResponse.data.simulation_fork.chain_config.chain_id,
  };
}
