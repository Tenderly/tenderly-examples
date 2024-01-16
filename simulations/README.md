# Simulations

Here you'll find examples how to simulate transactions using Tenderly.

## RPC
You can simulate transactions with Tenderly node using RPC methods `tenderly_simulate` and `tenderlySimulateBundle`. 

### Quickstart

```bash
cd simulations/rpc/mainnet
yarn
node 0-simulate.mjs  > 0-simulate.txt
vi 0-simulate.txt
vi 0-simulate.mjs
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
cd simulations/api/linea
yarn
node 0-simulate.mjs > 0-simulate.txt
vi 0-simulate.txt
vi 0-simulate.mjs
```

Simulation API allows you to simulate transactions and additionally:

- do [**storage overrides** of smart contracts' variables](https://docs.tenderly.co/simulations/state-overrides) in order to bring contracts into specific mock conditions.
- do **balance overrides** of involved accounts

Simulation API comes in [3 modes](https://docs.tenderly.co/simulations/simulation-modes): `quick`, `full` and `abi`.