import { createPublicClient, http } from "viem";
import { vMainnet } from "./tenderly.config";

const client = createPublicClient({
  chain: vMainnet,
  transport: http(process.env.VIRTUAL_MAINNET_RPC),
});

(async () => {
  const simulation: any = await client.request({
    //@ts-ignore
    method: "tenderly_simulateTransaction",
    params: [
      // transaction object
      {
        from: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        to: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        gas: "0x0",
        gasPrice: "0x0",
        value: "0x0",
        data: "0xa9059cbb00000000000000000000000020a5814b73ef3537c6e099a0d45c798f4bd6e1d60000000000000000000000000000000000000000000000000000000000000001",
      },
      // the block
      "latest",
    ],
  });

  console.log("Trace");
  console.log(JSON.stringify(simulation.trace, null, 2));
  console.log("Logs");
  console.log(JSON.stringify(simulation.logs, null, 2));
  console.log("Asset Changes");
  console.log(JSON.stringify(simulation.assetChanges, null, 2));
  console.log("Balance Changes");
  console.log(JSON.stringify(simulation.balanceChanges, null, 2));

})();