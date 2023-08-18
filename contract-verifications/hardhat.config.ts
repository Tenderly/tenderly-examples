import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";

import * as tenderly from "@tenderly/hardhat-tenderly";

tenderly.setup({ automaticVerifications: false });

const config: HardhatUserConfig = {
  networks: {
    tenderly: {
      // npm run spawn-devnet-to-hardhat project-slug devnet-template-slug
      // or spawn in Dashboard and copy manually
      url: "RPC URL",
    },
  },
  // point to your project
  tenderly: {
    project: "project-slug",
    username: "username or orgname",
  },
  solidity: {
    compilers: [{ version: "0.8.18" }],
    overrides: {
      // indicate the exact settings used by OZ for compiling the contracts you're using
      "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol": {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol":
        {
          version: "0.8.9",
          settings: {
            optimizer: {
              enabled: true,
              runs: 200,
            },
          },
        },

      "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol": {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol": {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  mocha: {
    timeout: 4 * 60 * 1000,
  },
};

export default config;
