// file: asset-balance-changes.ts
import * as viem from "viem";
import { mainnet } from "viem/chains";

const client = viem.createClient({
  chain: mainnet,
  transport: viem.http(`https://mainnet.gateway.tenderly.co/${process.env.ENDERLY_NODE_ACCESS_KEY}`),
});

(async () => {
  console.time("Decoded Events: RPC");

  const simulationResponse: any = await client.request({
    //@ts-ignore
    method: "tenderly_simulateTransaction",
    params:
      [{
        "from": "0xb4897d49c5859b9bb5e3d6c4372bdd83d55c8d6c",
        "to": "0xe592427a0aece92de3edee1f18e0157c05861564",
        "gas": "0x53020",
        "gasPrice": "0xa06177b61",
        "value": "0x0",
        "data": "0xf28c0498000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000b4897d49c5859b9bb5e3d6c4372bdd83d55c8d6c0000000000000000000000000000000000000000000000000000000065f9adc00000000000000000000000000000000000000000001ae22487c1042af08000000000000000000000000000000000000000000000000000e0bb23166c8ae7f8b30000000000000000000000000000000000000000000000000000000000000042a882606494d86804b5514e07e6bd2d6a6ee6d68a000bb8c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20001f46b175474e89094c44da98b954eedeac495271d0f000000000000000000000000000000000000000000000000000000000000",
      }, "0x1291540"],
  });

  console.timeEnd("Decoded Events: RPC");

  console.log("Decoded events", simulationResponse.logs);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

