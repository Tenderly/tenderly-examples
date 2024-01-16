// file: ethers-6-https.ts`
import * as ethers from "ethers";
import { Mnemonic, Wallet } from "ethers";

const RPC_URL = `https://virtual.mainnet.rpc.tenderly.co/0455d83d-fa26-4e8e-a89c-d12121985f8a`;
const EXPLORER_BASE_URL = "https://dashboard.tenderly.co/explorer/vnet/47cdac98-cda3-431a-8fce-9f31037a3d0c";

await (async () => {
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  const signer = Wallet.fromPhrase(Mnemonic.fromEntropy(ethers.randomBytes(24)).phrase, provider);

  await provider.send("tenderly_setBalance", [
    signer.address,
    "0xDE0B6B3A7640000",
  ]);

  const tx = await signer.sendTransaction({
    to: "0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC",
    value: ethers.parseEther("0.01"),
  });

  console.log(`${EXPLORER_BASE_URL}/tx/${tx.hash}`);
})();