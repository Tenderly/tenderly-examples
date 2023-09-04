import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as tenderly from "@tenderly/hardhat-tenderly";

tenderly.setup({ automaticVerifications: true });

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    virtualMainnet: {
      // https://docs.tenderly.co/virtual-testnets/quickstart
      url: "TESTNET PUBLIC RPC",
    },
  },
  tenderly: {
    // https://docs.tenderly.co/account/projects/account-project-slug
    project: "YOUR PROJECT",
    username: "YOUR USERNAME",
  },
};

export default config;
