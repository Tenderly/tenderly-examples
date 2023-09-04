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
    tenderly: {
      // tenderly network used for running tests
      chainId: 736031,
      url: "https://rpc.vnet.tenderly.co/devnet/mini-safe/fbdd9913-7e93-4d93-88fb-f41dddd9856d",
    },

    // Sepolia config in case you still want public testnets
    // sepolia: {
    //   url: process.env.SEPOLIA_RPC || "",
    //   chainId: 11155111, // Sepolia Chain ID
    // accounts: [
    //   /*
    //    TODO: (1) If you're following the tutorial at (LINK HERE)
    //    then paste your Metamask wallet's private key in .env as SEPOLIA_PRIVATE_KEY_1
    //    and uncomment the following line
    //    */
    //   // process.env.SEPOLIA_PRIVATE_KEY_1 || "", // uncomment me
    //   //
    //   //
    //   //
    //   /*
    //   TODO: (2) If you want to run `scripts/deploy-submit-execute.ts` on Sepolia
    //   you have to specify 4 private keys
    //   */
    //   process.env.SEPOLIA_PRIVATE_KEY_1 || "",
    //   process.env.SEPOLIA_PRIVATE_KEY_2 || "",
    //   process.env.SEPOLIA_PRIVATE_KEY_3 || "",
    //   process.env.SEPOLIA_PRIVATE_KEY_4 || "",
    // ],
    // },
  },

  tenderly: {
    project: process.env.TENDERLY_PROJECT_SLUG || "",
    username: process.env.TENDERLY_USERNAME || "",
    privateVerification: false,
  },
};

export default config;
