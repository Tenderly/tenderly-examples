# Node Examples

This section contains examples on usage of Tenderly node via:

- [Ethers 5](ethers-5/)
- [Viem examples](ethers-6/)
- [Viem examples](samples/viem)

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

## Running the samples

### Viem

```bash
source .env
cd samples/viem
yarn
npx ts-node 0-batch-calls.ts
npx ts-node 0-send-tx.ts
```

### Ethers 5

```bash
bash .env
cd ethers-5
yarn
npx ts-node json-rpc-https-provider.ts 
```

### Ethers 6

```bash
bash .env
cd ethers-6
yarn
npx ts-node json-rpc-https-provider.ts 
```


