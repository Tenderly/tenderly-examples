import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
  chain: mainnet,
  transport: http(`https://mainnet.gateway.tenderly.co/${TENDERLY_NODE_ACCESS_KEY}`),
});


console.log("Block Number", await client.getBlockNumber());