# Virtual TestNets

Before running the examples.

## Prerequisites

Install dependencies and set up [environment variables](.example.env)

- **`TENDERLY_ACCOUNT_ID`** with your [account ID](https://docs.tenderly.co/account/projects/account-project-slug)
- **`TENDERLY_PROJECT`** with your [project (slug)](https://docs.tenderly.co/account/projects/account-project-slug)
- **`TENDERLY_ACCESS_KEY`** with
  the [access key you've generated](https://docs.tenderly.co/account/projects/how-to-generate-api-access-token)
- **`PRIVATE_KEY`** for signing test transactions

```bash
yarn install
cp .example.example .env
vi .env # modify environment variables
```

## Interacting with TestNet

You can run the following examples without any additional configuration

**Ethers: Query the network**

```bash
source .env
npx ts-node src/ethers-6-https.ts 
```

**Ethers: Send a transaction**

```bash
source .env
npx ts-node src/ethers-send-tx.ts 
```

**Viem: Query the network**

```bash
source .env
npx ts-node src/viem.ts 
```

**Viem: Send a transaction**

```bash
source .env
npx ts-node src/viem-send-tx.ts
```

**Viem: Simulate a transaction**

```bash
source .env
npx ts-node src/viem-simulate.ts
```

## Create a TestNet via API

### 1. Extend configuration

Create an `.env` file in `src/contracts-staging`, and specify

- Tenderly access configuration:
  - **`TENDERLY_ACCOUNT_ID`** with your [account ID](https://docs.tenderly.co/account/projects/account-project-slug)
  - **`TENDERLY_PROJECT`** with your [project (slug)](https://docs.tenderly.co/account/projects/account-project-slug)
  - **`TENDERLY_ACCESS_KEY`** with
    the [access key you've generated](https://docs.tenderly.co/account/projects/how-to-generate-api-access-token)
  - **`PRIVATE_KEY`** for signing test transactions (if needed)
- TestNet configuration:
  - **`ORIGINAL_NETWORK_ID`** - the [ID of the network](https://docs.tenderly.co/supported-networks-and-languages) you
    want to base the TestNet on
  - **`TENDERLY_TESTNET_NAME`** - the name for the testnet
  - **`PURPOSE`** - leave `development`
  - **`BLOCK_NUMBER`** - either `latest` or a specific block number (`HEX`)

```bash
cp src/contracts-staging/.example.env .env
vi src/contracts-staging/.env
```

#### 2. Call the API

```bash
source src/contracts-staging/.env
cd src/contracts-staging

bash src/contracts-staging/create-testnet.sh
```

## Staging

To perform staging, follow these few steps.

### 2. Add deployment command

Edit `deploy-command.sh` with the commands that deploy contracts to the Virtual TestNet. Follow the given example.

### 3. Stage

Stage the contracts

```bash
# create a testnet - or paste the Unlocked TestNet RPC URL
source src/contracts-staging/.env
cd src/contracts-staging

## Create a fresh testnet
export VIRTUAL_NETWORK_RPC_URL=$(./create-testnet.sh)
echo "Created a Virtual TestNet at ${VIRTUAL_NETWORK_RPC_URL}"

### run the deployment
./deploy-to-testnet.sh
```
