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

```bash
source .env
npx ts-node src/ethers-6-https.ts 
```

```bash
npx ts-node src/viem.ts 
```

```bash
npx ts-node src/viem-simulate.ts
```

## Create a TestNet via API

### 1. Extend configuration

Edit `src/contracts-staging/.env` and add:

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
source .env
source src/contracts-staging/.env
cd src/contracts-staging

bash src/contracts-staging/create-testnet.sh
```

## Staging

To perform staging, follow these few steps

### 2. Add deployment command

Edit `deploy-command.sh` with the commands that deploy contracts to the Virtual TestNet.

### 3. Stage

Stage the contracts

```bash
# create a testnet - or paste the Unlocked TestNet RPC URL
source .env
source src/contracts-staging/.env
cd src/contracts-staging

## Create a fresh testnet
export RPC_URL=$(create-testnet.sh)
echo "Created a Virtual TestNet at ${RPC_URL}"
export VERIFICATION_URL=$RPC_URL/verify/etherscan

## run the deployment
bash deploy-to-testnet.sh
```
