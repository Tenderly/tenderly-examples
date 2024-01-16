# CI

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
bash .env
```

```bash
ci/lib/create-testnet.sh
```

## Remaining work:
[] Multi-chain support