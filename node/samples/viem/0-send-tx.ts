import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { mainnet } from "viem/chains";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

(async () => {
  const client = createWalletClient({
    account: privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}` || "0x"),
    chain: mainnet,
    transport: http(`https://mainnet.gateway.tenderly.co/${process.env.TENDERLY_NODE_ACCESS_KEY}`),
  });

  // will fail
  const tx = await client.sendTransaction({
    to: "0x0000000000000000000000000000000000000000",
    value: parseEther("0"),
  });
  console.log(tx);
})();