import { Network as ActionsNetwork, Context, AlertEvent } from '@tenderly/actions';
import { Network as SDKNetwork, Tenderly } from '@tenderly/sdk';
const ethers = require('ethers');

// Do not change function name.
const actionFn = async (context: Context, alertEvent: AlertEvent) => {

	const provider = new ethers.providers.JsonRpcProvider(context.gateways.getGateway(ActionsNetwork.MAINNET));
	const key = await context.secrets.get('ACCESS-KEY')

	const accountSlug = '';
	const projectSlug = '';
	const tagName = 'pool';

	const tenderly = new Tenderly({
		accountName: accountSlug,
		projectName: projectSlug,
		accessKey: key,
		network: SDKNetwork.MAINNET, // Replace with the appropriate network
	});

	const resp = await provider.send("tenderly_traceTransaction", [`${alertEvent.hash}`]);
	const poolCreatedLogs = resp.logs.filter((log: { name: string; }) => log.name === 'PoolCreated');
	const poolInput = poolCreatedLogs[0].inputs.find((input: { name: string; }) => input.name === 'pool');
	const poolAddress = poolInput.value;

	async function addContract(childContractAddress: string) {
		try {
			await tenderly.contracts.add(childContractAddress, {
				displayName: 'Pool'
			});
			await tenderly.contracts.update(childContractAddress, { appendTags: [tagName] });
			console.log(`Pool contract is: ${childContractAddress}, and has been added with tag ${tagName}`);
		}
		catch (error) {
			console.error('Error adding contract:', error);
		}
	}

	await addContract(poolAddress);
};

// Do not change this.
module.exports = { actionFn }; 