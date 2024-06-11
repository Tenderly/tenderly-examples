import { Context, AlertEvent } from '@tenderly/actions';
import { Tenderly } from '@tenderly/sdk';
const ethers = require('ethers');

const actionFn = async (context: Context, alertEvent: AlertEvent) => {
	const key = await context.secrets.get('ACCESS-KEY');

	const accountSlug = '{account_id}';
	const projectSlug = '{project_slug}';
	const tagName = 'pool';

	const tenderly = new Tenderly({
		accountName: accountSlug,
		projectName: projectSlug,
		accessKey: key,
		network: Number(alertEvent.network),
	});

	const poolCreatedSignature = ethers.utils.id("PoolCreated(address,address,uint24,int24,address)");

	let poolAddress = "";
	for (const log of alertEvent.logs) {
		if (log.topics[0] === poolCreatedSignature) {
			const data = log.data;
			const addressHex = data.substring(data.length - 40);
			poolAddress = ethers.utils.getAddress('0x' + addressHex).toLowerCase();
			break;
		}
	}

	try {
		await tenderly.contracts.add(poolAddress, {
			displayName: 'Pool'
		});
		await tenderly.contracts.update(poolAddress, { appendTags: [tagName] });
		console.log(`Pool contract is: ${poolAddress}, and has been added with tag ${tagName}`);
	} catch (error) {
		console.error('Error adding contract:', error);
	}
};

module.exports = { actionFn };
