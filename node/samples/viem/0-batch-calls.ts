import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

// use the configured TENDERLY_NODE_ACCESS_KEY (env variable)
// If not set, will fall back to public node
const TENDERLY_NODE_ACCESS_KEY = process.env.TENDERLY_NODE_ACCESS_KEY ?? "";

(async () => {
  if (!TENDERLY_NODE_ACCESS_KEY) {
    console.warn(
      "You're using public node that is rate limited. Please create a https://dashboard.tenderly.co)",
    );
  }

  const client = createPublicClient({
    chain: mainnet,
    transport: http(
      `https://mainnet.gateway.tenderly.co/${TENDERLY_NODE_ACCESS_KEY}`,
      {
        batch: true,
      },
    ),
  });

  const [blockNumber, balance, ensName] = await Promise.all([
    client.getBlockNumber(),
    client.getBalance({ address: "0xd2135CfB216b74109775236E36d4b433F1DF507B" }),
    client.getEnsName({ address: "0xd2135CfB216b74109775236E36d4b433F1DF507B" }),
    client.getChainId(),
  ]);
  console.log("Results are in");
  console.log({ blockNumber, balance, ensName });

  //  So will this
  const bnPromise = client.getBlockNumber();

  const balancePromise = client.getBalance({
    address: "0xd2135CfB216b74109775236E36d4b433F1DF507B",
  });

  console.log(await bnPromise);
  console.log(await balancePromise);
})();