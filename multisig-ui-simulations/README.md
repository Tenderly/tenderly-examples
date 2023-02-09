# Simulations and forks with Multisig wallet

This repository consists of:

- front: a SvelteKit app demonstrating usage of Multisig wallet and TicTacToe contracts, combined with Tenderly Simulation API and Forks.
- hardhat: the smart contract side, which:
  - includes `Multisig` and `TicTacToe` contracts
  - tests of `Multisig` contract
  - deployment for `Multisig` and `TicTacToe` contracts
  - Note: When depolying contracts

# Prepare

1. Create `hardhat/.env` and `front/.env` file:

```bash
cp hardhat/.tpl.env hardhat/.env
cp front/.tpl.env front/.env
```

2. Go to `hardhat/.env` and follow the links to obtain the access key, project name and username and fill in to appropriate fields.
3. Go to `front/.env` and fill in the `VITE_TENDERLY_API_KEY`.
4. Run the following command to set up a fork and deploy the multisig contract:

```bash
npm run tenderly:ui-dev-fork
```

After running this command:

- The contracts will get deployed to the fork, which comes with 10 accounts with 100 ETH each.
- The `front/.env` will get the addresses of the contracts and the fork URL used by the UI.

# Run

To run tests:

```bash
cd hardhat
npx hardhat test --network tenderly
```

To run the frontend:

- make sure you ran `npm run tenderly:ui-dev-fork`
- run:

```bash
cd front
npm run dev
```
