// file: ethers-6-https.mjs
import { JsonRpcProvider } from "ethers";
import { basename } from "./utils";
import * as url from "url";

(function main() {
  fund().then(() => console.log("Done"));
})();

async function fund() {
  const RPC_URL = process.env.VIRTUAL_MAINNET_RPC_URL || "";
  const EXPLORER_BASE_URL = `https://dashboard.tenderly.co/explorer/vnet/${basename(RPC_URL)}`;

  const provider = new JsonRpcProvider(RPC_URL);
  const ret = await Promise.all([
    provider.send("tenderly_setBalance", [
      ["0x0d2026b3EE6eC71FC6746ADb6311F6d3Ba1C000B", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
      "0xDE0B6B3A7640000",
    ]),

    // USDT
    provider.send("tenderly_setErc20Balance", [
      "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "0x40BdB4497614bAe1A67061EE20AAdE3c2067AC9e",
      "0xDE0B6B3A7640000",
    ]),

    // DAI
    provider.send("tenderly_setErc20Balance", [
      "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      "0x40BdB4497614bAe1A67061EE20AAdE3c2067AC9e",
      "0xDE0B6B3A7640000",
    ]),
    // Shiba Inu
    provider.send("tenderly_setErc20Balance", [
      "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
      "0x40BdB4497614bAe1A67061EE20AAdE3c2067AC9e",
      "0xDE0B6B3A7640000",
    ]),
  ]);
  console.log("ETH balance, DAI and ShibaInu topups", ret.map(txHash => `${EXPLORER_BASE_URL}/tx/${txHash}`));
}