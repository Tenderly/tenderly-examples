import { defineChain } from "viem";
import { basename } from "./utils";
export const vMainnet = defineChain({
  id: 73571,
  name: 'Virtual Ethereum Mainnet',
  nativeCurrency: { name: 'vEther', symbol: 'vETH', decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.VIRTUAL_MAINNET_RPC_URL!] }
  },
  blockExplorers: {
    default: {
      name: 'Tenderly Explorer',
      url: `https://dashboard.tenderly.co/explorer/vnet/${basename(process.env.VIRTUAL_MAINNET_RPC_URL!)}`
    }
  }
})