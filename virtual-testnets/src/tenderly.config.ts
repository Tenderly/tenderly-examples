import { defineChain, Hex } from "viem";
import path from "node:path";

export const vMainnet = defineChain({
  id: 73571,
  name: "Virtual Ethereum Mainnet",
  nativeCurrency: { name: "vEther", symbol: "vETH", decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.VIRTUAL_MAINNET_RPC_URL!] },
  },
  blockExplorers: {
    default: {
      name: "Tenderly Explorer",
      url: `https://dashboard.tenderly.co/explorer/vnet/${path.basename(process.env.VIRTUAL_MAINNET_RPC_URL!)}`,
    },
  },
});

export type TSetBalanceRpc = {
  method: "tenderly_setBalance",
  Parameters: [addresses: Hex[], value: Hex],
  ReturnType: Hex
}

export type TSetErc20BalanceRpc = {
  method: "tenderly_setErc20Balance",
  Parameters: [erc20: Hex, to: Hex, value: Hex],
  ReturnType: Hex
}