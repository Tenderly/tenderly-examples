import { createWalletClient, http, parseEther } from "viem";
import { vMainnet } from "./tenderly.config";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";


const EXPLORER_BASE_URL = vMainnet.blockExplorers.default;

const account = privateKeyToAccount(generatePrivateKey());
(async () => {
  const client = createWalletClient({
    account,
    chain: vMainnet,
    transport: http(vMainnet.rpcUrls.default.http[0]),
  });

  await client.request({
    //@ts-ignore
    method: "tenderly_setBalance",
    params: [
      account.address,
      "0xDE0B6B3A7640000",
    ],
  });

  const tx = await client.sendTransaction({
    to: "0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC",
    value: parseEther("0.01"),
  });

  console.log(`${EXPLORER_BASE_URL}/tx/${tx}`);
})();