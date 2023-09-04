import { Client, Hex } from "viem";

type TSetBalanceParams = [addresses: Hex[], value: Hex];

async function tenderlySetBalance(client: Client, params: TSetBalanceParams) {
  return client.request<{
    method: "tenderly_setBalance",
    Parameters: TSetBalanceParams,
    ReturnType: Hex
  }>({
    method: "tenderly_setBalance",
    params: params,
  });
}

type TSetErc20BalanceParams = [erc20: Hex, to: Hex, value: Hex]

async function tenderlySetErc20Balance(client: Client, params: TSetErc20BalanceParams) {
  return client.request<{
    method: "tenderly_setErc20Balance",
    Parameters: TSetErc20BalanceParams,
    ReturnType: Hex
  }>({
    method: "tenderly_setErc20Balance",
    params: params,
  });
}

type TSimulationRequestParams = [simulationRequest: {
  from: Hex,
  to: Hex,
  gas: Hex,
  gasPrice: Hex,
  value: Hex,
  data: Hex,
}, blockNumber: "latest" | Hex];


type AssetChange = {
  "assetInfo": {
    "standard": "ERC20" | "",
    "type": "Fungible" | "NonFungible",
    "contractAddress": Hex,
    "symbol": string,
    "name": string,
    "logo": string,
    "decimals": number,
    "dollarValue": "${number}"
  },
  "type": string,
  "from": Hex,
  "to": Hex,
  "rawAmount": Hex,
  "amount": `${number}`,
  "dollarValue": `${number}`,
}

type Log = {
  "name": String,
  "anonymous": boolean,
  "inputs": {
    "value": Hex,
    "type": string,
    "name": string
  }[],
  "raw": {
    "address": Hex,
    "topics": [
      Hex,
      Hex,
      Hex
    ],
    "data": Hex
  }
}

type Trace = {
  "type": string,
  "from": Hex,
  "to": Hex,
  "gas": Hex,
  "gasUsed": Hex,
  "value": Hex,
  "input": Hex,
  "decodedInput": {
    "value": Hex,
    "type": string,
    "name": string
  }[],
  "method": "string",
  "output": Hex,
  "decodedOutput": {
    "value": boolean,
    "type": string,
    "name": string
  }[],
  "subtraces": number,
  "traceAddress": any[]
}


async function tenderlySimulateTransaction(client: Client, params: TSimulationRequestParams) {
  return client.request<
    {
      method: "tenderly_simulateTransaction",
      Parameters: TSimulationRequestParams,
      ReturnType: {
        trace: Trace[],
        logs: Log[],
        assetChanges: AssetChange[],
        balanceChanges: {
          "address": Hex
          "dollarValue": `${number}`,
          "transfers": any
        }[]
      }
    }
  >({
    method: "tenderly_simulateTransaction",
    params: params,
  });
}


export {
  tenderlySetBalance, tenderlySetErc20Balance, tenderlySimulateTransaction,
};