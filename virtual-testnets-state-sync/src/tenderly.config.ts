import { defineChain } from "viem";
import path from "node:path";
import * as dotenv from "dotenv";
dotenv.config();

export const vSepolia = defineChain({
  id: Number.parseInt(process.env.TENDERLY_VIRTUAL_TESTNET_CHAIN_ID!),
  name: "Virtual Sepolia",
  nativeCurrency: { name: "vSepEth", symbol: "vSETH", decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.TENDERLY_VIRTUAL_TESTNET_RPC_URL_SEPOLIA!] },
  },
  blockExplorers: {
    default: {
      name: "Tenderly Explorer",
      url: `https://dashboard.goerli.co/explorer/vnet/${path.basename(process.env.TENDERLY_VIRTUAL_TESTNET_RPC_URL_SEPOLIA!)}`,
    },
  },
});
