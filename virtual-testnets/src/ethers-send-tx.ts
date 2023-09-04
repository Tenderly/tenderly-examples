import * as ethers from "ethers";
import { Mnemonic, Wallet } from "ethers";
import path from "node:path";

const EXPLORER_BASE_URL = `https://dashboard.tenderly.co/explorer/vnet/${path.basename(process.env.VIRTUAL_MAINNET_RPC_URL!)}`;

const provider = new ethers.JsonRpcProvider(process.env.VIRTUAL_MAINNET_RPC_URL!);
const signer = Wallet.fromPhrase(Mnemonic.fromEntropy(ethers.randomBytes(24)).phrase, provider);

(async () => {
  await provider.send("tenderly_setBalance", [
    signer.address,
    "0xDE0B6B3A7640000",
  ]);

  const tx = await signer.sendTransaction({
    to: "0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC",
    value: ethers.parseEther("0.01"),
  });

  console.log(`${EXPLORER_BASE_URL}/tx/${tx.hash}`);
})().catch(e => {
  console.error(e);
  process.exitCode = 1;
});