import { Chain, createPublicClient, createWalletClient, encodeFunctionData, http, WalletClient } from "viem";
import { vSepolia } from "./tenderly.config";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { waitForTransactionReceipt } from "viem/actions";
import { setTimeout } from "timers/promises";

const account = privateKeyToAccount(process.env.PRIVATE_KEY as "0x${string}" || "");
const counterAddress = "0x1D93236d4078F9d1b66D9dd3E297C083A0348cfE";

const VIEM_CONFIRMATION_NUMBER = 1;

const key = Math.floor(Math.random() * 9007199254740991);

console.log(`Playing with Counter(${counterAddress}).numbers[${key}]`);

(async () => {
  await call();
})();

async function logNumber() {
  console.log("State:", `
  sepolia: ${await getCounterOnChain(sepolia)}
  virtualSepolia: ${await getCounterOnChain(vSepolia)}`);
}

async function call() {
  const testNetClient = createTestNetClient();
  const sepoliaClient = createSepoliaClient();

  await testNetClient.request({
    // @ts-ignore
    method: "tenderly_setBalance",
    params: [
      account.address,
      "0xDE0B6B3A7640000",
    ],
  });


  console.log("State:", `
  sepolia: ${await getCounterOnChain(sepolia)}
  virtualSepolia: ${await getCounterOnChain(vSepolia)}`);

  await setNumber(sepoliaClient, 1);
  await logNumber();

  await setNumber(testNetClient, 10);
  await logNumber();

  await setNumber(sepoliaClient, 100);
  await logNumber();

}

async function setNumber(client: WalletClient, value: number) {
  const chainName = client.chain?.name;
  console.log("\n================================================================================================");

  console.log(`Write: Counter(${counterAddress})@${chainName}.numbers[${key}] = ${value}`);

  const request = await client.prepareTransactionRequest({
    chain: client.chain,
    account,
    to: counterAddress,
    data: encodeFunctionData({
      abi: counterAbi(),
      functionName: "setNumber",
      args: [key, value],
    }),

  });
  const setValueTx = await client.sendRawTransaction({ serializedTransaction: await client.signTransaction(request) });
  await waitForTransactionReceipt(client, { hash: setValueTx, confirmations: VIEM_CONFIRMATION_NUMBER });
  console.log(`Tx hash: ${setValueTx}`);
  await setTimeout(5 * 1000);
}


function createTestNetClient() {
  return createWalletClient({
    account,
    chain: vSepolia,
    // @ts-ignore
    transport: http(vSepolia.rpcUrls.default[0]),
  });
}

function createSepoliaClient() {
  return createWalletClient({
    account,
    chain: sepolia,
    // @ts-ignore
    transport: http("https://sepolia.gateway.tenderly.co"),
  });
}

async function getCounterOnChain(chain: Chain) {
  return await createPublicClient({
    chain,
    transport: http(),
  }).readContract({
    address: counterAddress,
    abi: counterAbi(),
    functionName: "numbers",
    args: [key],
  });
}

function counterAbi() {
  return [{
    "inputs": [{ "internalType": "uint256", "name": "key", "type": "uint256" }],
    "name": "increment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  }, {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "numbers",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function",
  }, {
    "inputs": [
      { "internalType": "uint256", "name": "key", "type": "uint256" }, {
        "internalType": "uint256",
        "name": "newNumber",
        "type": "uint256",
      }], "name": "setNumber", "outputs": [], "stateMutability": "nonpayable", "type": "function",
  }];
}