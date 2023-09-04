# Simulations

Here you'll find examples how to simulate transactions using Tenderly.

## Environment setup

Set up environment variables:

- **`TENDERLY_ACCOUNT_ID`** with your [account ID](https://docs.tenderly.co/account/projects/account-project-slug)
- **`TENDERLY_PROJECT`** with your [project (slug)](https://docs.tenderly.co/account/projects/account-project-slug)
- **`TENDERLY_ACCESS_KEY`** with
  the [access key you've generated](https://docs.tenderly.co/account/projects/how-to-generate-api-access-token)
- **`PRIVATE_KEY`** for signing test transactions
- **`ORIGINAL_NETWORK_ID`** with the [ID of the network](https://docs.tenderly.co/supported-networks-and-languages) you
  want to base the TestNet on

```bash
cp .env.example .env
vi .env # modify environment variables
```

## RPC

You can simulate transactions with Tenderly node using RPC methods `tenderly_simulate` and `tenderlySimulateBundle`.

### Quickstart

```bash
source .env
cd rpc/mainnet
yarn
npx ts-node 0-simulate.ts
```

RPC simulations are available for all networks supported on [Tenderly Node](https://docs.tenderly.co/node/reference).

Each simulation results contains the following:

- `balanceChanges` - changes on all accounts involved in the transaction
- `assetChanges` - all asset exchanges that happen throughout
- `trace` - decoded transaction call trace
- `gasUsed` - total gas used in the simulation, useful for precise gas estimation

Learn more about [RPC simulations](https://docs.tenderly.co/simulations/bundled-simulations).

## API

You can simulate transactions with Tenderly node using the Simulation REST API.

### Quickstart

```bash
source .env
cd api/linea
yarn 
npx ts-node 0-simulate.ts 
```

Simulation API allows you to simulate transactions and additionally:

- do [**storage overrides** of smart contracts' variables](https://docs.tenderly.co/simulations/state-overrides) in
  order to bring contracts into specific mock conditions.
- do **balance overrides** of involved accounts

Simulation API comes in [3 modes](https://docs.tenderly.co/simulations/simulation-modes): `quick`, `full` and `abi`.