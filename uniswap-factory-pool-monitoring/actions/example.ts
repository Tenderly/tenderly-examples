const ethers = require('ethers');
import { Network, Context, AlertEvent } from '@tenderly/actions';
const axios = require('axios');

// Do not change function name.
const actionFn = async (context: Context, alertEvent: AlertEvent) => {

	const provider = new ethers.providers.JsonRpcProvider(context.gateways.getGateway(Network.MAINNET));
	const key = await context.secrets.get('ACCESS-KEY')
	const networkId = "1";
	const tagName = "child";

	const resp = await provider.send("tenderly_traceTransaction", [`${alertEvent.hash}`]);
	const poolCreatedLogs = resp.logs.filter((log: { name: string; }) => log.name === 'PoolCreated');
	const poolInput = poolCreatedLogs[0].inputs.find((input: { name: string; }) => input.name === 'pool');
	const poolAddress = poolInput.value;

	async function callYourApi(childContractAddress: any) {
		const axiosInstance = axios.create({
			baseURL: 'https://api.tenderly.co/api/v1'
		});
		axiosInstance.defaults.headers.common['X-Access-Key'] = key;

		const contractData = {
			"network_id": `${networkId}`,
			"address": `${childContractAddress}`
		};

		const tagData = {
			"tag":`${tagName}`,
			"contract_ids":[`eth:${networkId}:${childContractAddress}`]
		}

		try {
			await axiosInstance.post(`account/me/project/monitoring/address`, contractData);
			await axiosInstance.post(`account/me/project/monitoring/tag`, tagData);
			console.log(`Pool contract is: ${childContractAddress}, and has been added with tag ${tagName}`);
		} catch (error) {
			console.error("Error calling Tenderly API:", error);
		}
	}

	await callYourApi(poolAddress);
};

// Do not change this.
module.exports = { actionFn }; 