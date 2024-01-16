import { createPublicClient, http } from "viem";
import { vMainnet } from "./tenderly.config";

async function example() {

  const EXPLORER_BASE_URL = "https://dashboard.tenderly.co/explorer/vnet/47cdac98-cda3-431a-8fce-9f31037a3d0c";

  const client = createPublicClient({
    chain: vMainnet,
    transport: http(vMainnet.rpcUrls.default.http[0]),
  });


  console.log("Block Number", await client.getBlockNumber());
  console.log("Chain", await client.getChainId());

  const strings = ["0x0d2026b3EE6eC71FC6746ADb6311F6d3Ba1C000B", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"];

  function tenderly_setBalance(addresses: string[], value: string = "0xDE0B6B3A7640000") {
    return client.request<{
      method: "tenderly_setBalance",
      Parameters: [string[], string],
      ReturnType: `0x${string}`
    }>({
      method: "tenderly_setBalance",
      params: [addresses, value],
    });
  }

  function tenderly_setErc20Balance(erc20: `0x${string}`, to: `0x${string}`, value: `0x${string}` = "0xDE0B6B3A7640000") {
    return client.request<{
      method: "tenderly_setErc20Balance",
      Parameters: [`0x${string}`, `0x${string}`, `0x${string}`],
      ReturnType: `0x${string}`
    }>({
      method: "tenderly_setErc20Balance",
      params: [erc20, to, value],
    });
  }
``

  const balanceTxs = await Promise.all([
      tenderly_setBalance(strings),
      tenderly_setErc20Balance("0xdAC17F958D2ee523a2206206994597C13D831ec7",
        "0x40BdB4497614bAe1A67061EE20AAdE3c2067AC9e"),
      // USDT
      tenderly_setErc20Balance("0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "0x40BdB4497614bAe1A67061EE20AAdE3c2067AC9e"),
      tenderly_setErc20Balance("0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
        "0x40BdB4497614bAe1A67061EE20AAdE3c2067AC9e",
        "0xDE0B6B3A7640000"),
    ])
  ;

  console.log(
    "ETH balance, DAI and ShibaInu topups",
    balanceTxs.map(txHash => `${EXPLORER_BASE_URL}/tx/${txHash}`));
}

(function main() {
  example().then(() => console.log("Done"));
})();