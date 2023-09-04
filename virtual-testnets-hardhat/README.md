# Sample Hardhat Project

This project
demonstrates [automatic deployment of contracts to Tenderly Virtual TestNet](https://docs.tenderly.co/virtual-testnets/integrations-smart-contract-frameworks/hardhat).

Requirements:

- Tenderly [CLI installed](https://github.com/Tenderly/tenderly-cli?tab=readme-ov-file#installation)
- CLI [logged in](https://github.com/Tenderly/tenderly-cli?tab=readme-ov-file#login)
- You've [created a TestNet](https://docs.tenderly.co/virtual-testnets/quickstart)
- [**`hardhat.config.ts`**](./hardhat.config.ts#L9) uses the RPC link (`networks.virtualMainnet.url`).

To deploy and verify contracts, run the following command:

```shell
 npx hardhat run scripts/deploy.ts --network virtualMainnet
```

Learn more about hardhat verification setup in [this guide](https://docs.tenderly.co/contract-verification/hardhat).