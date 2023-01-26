import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@tenderly/hardhat-tenderly";
import * as dotenv from "dotenv";
import * as tenderly from "@tenderly/hardhat-tenderly";

dotenv.config();
tenderly.setup({ automaticVerifications: true });

const config: HardhatUserConfig = {
  solidity: "0.8.17",

  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC || "",
      chainId: 11155111, // Sepolia Chain ID
      accounts: [
        /*
         TODO: (1) If you're following the tutorial at (LINK HERE)
         then paste your Metamask wallet's private key in .env as SEPOLIA_PRIVATE_KEY_1
         and uncomment the following line
         */
        // process.env.SEPOLIA_PRIVATE_KEY_1 || "", // uncomment me
        //
        //
        //
        /* 
        TODO: (2) If you want to run `scripts/deploy-submit-execute.ts` on Sepolia
        you have to specify 4 private keys
        */
        // process.env.SEPOLIA_PRIVATE_KEY_1 || "",
        // process.env.SEPOLIA_PRIVATE_KEY_2 || "",
        // process.env.SEPOLIA_PRIVATE_KEY_3 || "",
        // process.env.SEPOLIA_PRIVATE_KEY_4 || "",
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
