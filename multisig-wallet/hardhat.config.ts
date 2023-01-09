import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@tenderly/hardhat-tenderly";
import * as dotenv from "dotenv";
import * as tenderly from "@tenderly/hardhat-tenderly";

dotenv.config();
tenderly.setup({ automaticVerifications: false });

const config: HardhatUserConfig = {
  solidity: "0.8.17",

  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC || "",
      accounts: [
        process.env.SEPOLIA_PRIVATE_KEY_1 || "",
        process.env.SEPOLIA_PRIVATE_KEY_2 || "",
        process.env.SEPOLIA_PRIVATE_KEY_3 || "",
        process.env.SEPOLIA_PRIVATE_KEY_4 || "",
      ],
    },

    tenderly: {
      // tenderly network used for running tests
      chainId: Number.parseInt(process.env.TENDERLY_FORK_CHAINID || "SET ME"),
      url: process.env.TENDERLY_FORK_URL || "SET ME",
    },
  },

  tenderly: {
    project: process.env.TENDERLY_PROJECT_SLUG || "SET ME",
    username: process.env.TENDERLY_USERNAME || "SET ME",
    privateVerification: true,
  },
};

// disable automatic contract verification
tenderly.setup({ automaticVerifications: false });

export default config;
