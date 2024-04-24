import { createPublicClient, http } from "viem";
import { vMainnet } from "./tenderly.config";
import { tenderlySetBalance, tenderlySetErc20Balance } from "./viem-tenderly-actions";

(async () => {
  const client = createPublicClient({
    chain: vMainnet,
    transport: http(vMainnet.rpcUrls.default.http[0]),
  });

  console.log("Block Number", await client.getBlockNumber());
  console.log("Chain", await client.getChainId());

  const strings: `0x${string}`[] = ["0x0d2026b3EE6eC71FC6746ADb6311F6d3Ba1C000B", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"];

  const balanceTxs = await Promise.all([
    tenderlySetBalance(client, [strings, "0xDE0B6B3A7640000"]),
    tenderlySetErc20Balance(client, ["0xdAC17F958D2ee523a2206206994597C13D831ec7", "0x40BdB4497614bAe1A67061EE20AAdE3c2067AC9e", "0xDE0B6B3A7640000"]),
    // USDT
    tenderlySetErc20Balance(client, ["0x6B175474E89094C44Da98b954EedeAC495271d0F", "0x40BdB4497614bAe1A67061EE20AAdE3c2067AC9e", "0xDE0B6B3A7640000"]),
    tenderlySetErc20Balance(client, ["0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", "0x40BdB4497614bAe1A67061EE20AAdE3c2067AC9e", "0xDE0B6B3A7640000"]),
  ]);

  console.log(
    "ETH balance, DAI and ShibaInu topups",
    balanceTxs.map(txHash => `${(vMainnet.blockExplorers.default.url)}/tx/${txHash}`));
})().catch(e => {
  console.error(e);
  process.exitCode = 1;
});
