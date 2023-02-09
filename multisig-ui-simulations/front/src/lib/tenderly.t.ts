export type TenderlyConfig = {
  user: string;
  project: string;
  apiAccessKey: string;
  gatewayAccessKey: string;
  fork: {
    rpcUrl: string;
    networkId: number;
  };
};

export type MultisigTransaction = {
  from: string;
  to: string;
  value: string;
  data: string;
};

export const getForkUrl = (tenderlyConfig: TenderlyConfig) => {
  const urlSegments = tenderlyConfig.fork.rpcUrl.split('/');
  const forkId = urlSegments[urlSegments.length - 1];
  return `https://dashboard.tenderly.co/${tenderlyConfig.user}/${tenderlyConfig.project}/fork/${forkId}`;
};

export const getForkRpc = (tenderlyConfig: TenderlyConfig) => {
  const urlSegments = tenderlyConfig.fork.rpcUrl.split('/');
  const forkId = urlSegments[urlSegments.length - 1];
  return `https://dashboard.tenderly.co/${tenderlyConfig.user}/${tenderlyConfig.project}/fork/${forkId}`;
};

export type TxSimulationOutcome = {
  status: null | 'success' | 'fail';
  url?: string;
  message?: string;
};

export async function simulate(
  params: MultisigTransaction,
  tenderlyConfig: TenderlyConfig
): Promise<TxSimulationOutcome> {
  try {
    console.log(tenderlyConfig);
    const simulationUrl = `https://api.tenderly.co/api/v1/account/${tenderlyConfig.user}/project/${tenderlyConfig.project}/simulate`;

    const ret = await fetch(simulationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': tenderlyConfig.apiAccessKey
      },
      body: JSON.stringify({ ...params, save: true })
    });

    const sim = await ret.json();
    console.log('Simulation', sim);

    if (!!sim.error && !!sim.error.message) {
      return { status: 'fail', url: '', message: sim.error.message };
    }

    const simId = sim.simulation.id;
    const errorMessage = sim.transaction.error_message;
    console.log(errorMessage);

    const simUrl = `https://dashboard.tenderly.co/${tenderlyConfig.user}/${tenderlyConfig.project}/simulator/${simId}`;
    if (!!errorMessage) {
      console.log('Fail');
      return { status: 'fail', url: simUrl, message: errorMessage };
    }

    return { status: 'success', url: simUrl };
  } catch (e: any) {
    console.log(e);
    return { status: 'fail', message: e.toString() };
  }
}
