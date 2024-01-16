import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

(async () => {
  const client = createPublicClient({
    chain: mainnet,
    transport: http(`https://mainnet.gateway.tenderly.co/${process.env.TENDERLY_NODE_ACCESS_KEY}`),
  });


  const txTrace: any = await client.request({
    //@ts-ignore
    method: "tenderly_traceTransaction",
    params: [
      // transaction hash
      "0x6b2264fa8e28a641d834482d250080b39cbbf39251344573c7504d6137c4b793",
    ],
  });


  console.log("Logs");
  console.log(JSON.stringify(txTrace.logs, null, 2));
  console.log("=======================================================");
  console.log("Asset Changes");
  console.log(JSON.stringify(txTrace.assetChanges, null, 2));
  console.log("=======================================================");
  console.log("Balance Changes");
  console.log(JSON.stringify(txTrace.balanceChanges, null, 2));
  console.log("=======================================================");
})();

