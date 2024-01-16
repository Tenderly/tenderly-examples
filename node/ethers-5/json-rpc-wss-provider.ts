// Installation Instructions: https://docs.ethers.io/v5/getting-started
import { ethers } from "ethers";

const RPC_URL_WSS = `wss://mainnet.gateway.tenderly.co/${process.env.TENDERLY_NODE_ACCESS_KEY}`;

await (async () => {
  // Initialize an ethers provider instance
  const provider = new ethers.providers.WebSocketProvider(RPC_URL_WSS);

  const blockNumber = await provider.getBlockNumber();

  console.log(blockNumber);
})();