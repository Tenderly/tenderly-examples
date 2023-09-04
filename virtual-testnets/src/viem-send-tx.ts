import { createWalletClient, http, parseEther } from "viem";
import { vMainnet } from "./tenderly.config";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { tenderlySetBalance } from "./viem-tenderly-actions";

const account = privateKeyToAccount(generatePrivateKey());
const client = createWalletClient({
  account,
  chain: vMainnet,
  transport: http(vMainnet.rpcUrls.default.http[0]),
});

(async () => {
  await tenderlySetBalance(client, [
    [account.address],
    "0xDE0B6B3A7640000",
  ]);

  const tx = await client.sendTransaction({
    to: "0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC",
    value: parseEther("0.01"),
  });

  console.log(`${(vMainnet.blockExplorers.default.url)}/tx/${tx}`);
})().catch(e => {
  console.error(e);
  process.exitCode = 1;
});