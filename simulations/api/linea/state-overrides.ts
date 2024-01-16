// file: state-overrides.ts
import axios from "axios";

(function main() {
  simulateTransaction().catch(console.error);
})();

async function simulateTransaction() {
  const { TENDERLY_ACCOUNT_ID, TENDERLY_PROJECT, TENDERLY_ACCESS_KEY } = process.env;
  try {
    console.time("State Overrides: State Overrides");

    const simulationResponse = await axios.post(
      `https://api.tenderly.co/api/v1/account/${TENDERLY_ACCOUNT_ID}/project/${TENDERLY_PROJECT}/simulate`,
      {
        // quick mode - does not decode call trace and events logs
        simulation_type: "quick",
        // simulations show up in the dashboard (success or fail)
        save: true,
        // failing simulations show up in the dashboard
        save_if_fails: true,

        network_id: "59144",
        // use the state from this block number
        block_number: 2050344,
        transaction_index: 3,
        from: "0xa5282a67337e0381dc47b9a16a91960b0a5eb9b2",
        to: "0x272e156df8da513c69cb41cc7a99185d53f926bb",
        gas: 204160,
        gas_price: "1923951822",
        value: "5000000000000000",

        // Optional: pin to specific block and timestamp.
        // If omitted, timestamp from the  `block_number` will be used
        block_header: {
          number: "0x1f4928",
          timestamp: "0x65bf925c",
          gasLimit: "0x3a2c940",
          baseFeePerGas: "0x7",
        },
        // access list
        access_list: [],
        generate_access_list: true,
        state_objects: {
          // modify contract 0x81ee7797156ef586b49731a490f83066241b1220
          // at storage slot 0x3, set value 1 (https://dashboard.tenderly.co/tx/linea/0xb1a5430c7f580dca16f9382c46c656aab53924a5754dc31b21e00a36c3bec513/debugger?trace=0.1.3.1)
          "0x81ee7797156ef586b49731a490f83066241b1220": {
            storage: {
              "0x0000000000000000000000000000000000000000000000000000000000000003":
                "0x0000000000010000000000000000000000000000000000000000000000000000",
            },
          },
        },
        // the raw call-data of the TX
        input:
          "0xa8c9ed67000000000000000000000000e5d7c2a44ffddf6b295a15c148167daaaf5cf34f000000000000000000000000eb466342c4d449bc9f53a865d5cb90586f405215000000000000000000000000000000000000000000000000000000000000012c000000000000000000000000a5282a67337e0381dc47b9a16a91960b0a5eb9b20000000000000000000000000000000000000000000000000000000065bf96f00000000000000000000000000000000000000000000000000011c37937e080000000000000000000000000000000000000000000000000000000000000ab07cc0000000000000000000000000000000000000000000000000000000000000000",
      },
      {
        headers: {
          "X-Access-Key": TENDERLY_ACCESS_KEY,
        },
      }
    );

    console.time("State Overrides: State Overrides");

    console.log(
      "Simulation Success (expected to FAIL, we set up pool as locked)",
      simulationResponse.data.simulation.status
    );
    
  } catch (e: any) {
    console.log(e.response.data.error);
  }
}
