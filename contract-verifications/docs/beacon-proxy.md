## Beacon Proxy

```ts
import { getImplementationAddress } from "@openzeppelin/upgrades-core";
import { ethers, tenderly, upgrades } from "hardhat";
import { Vault } from "../typechain-types";

async function deployVaultAndVerifyInTenderly() {
  const VaultFactory = await ethers.getContractFactory("Vault");
  const TokenFactory = await ethers.getContractFactory("TToken");

  const token = await TokenFactory.deploy();
  await token.deployed();

  await tenderly.verify({
    name: "TToken",
    address: token.address,
  });

  const vault = await upgrades.deployProxy(VaultFactory, [token.address], {
    kind: "transparent",
  });

  await vault.deployed();

  const Beacon = await ethers.getContractFactory("UpgradeableBeacon");
  const beacon = await Beacon.deploy(vault.address);
  await beacon.deployed();

  const BeaconProxy = await ethers.getContractFactory("BeaconProxy");
  const proxy = await BeaconProxy.deploy(
    beacon.address,
    /* data: bytes */ "0x"
  );
  await proxy.deployed();

  await tenderly.verify({
    name: "Vault",
    address: await getImplementationAddress(ethers.provider, vault.address),
  });

  await tenderly.verify({
    name: "UpgradeableBeacon",
    address: beacon.address,
  });

  await tenderly.verify({
    name: "BeaconProxy",
    address: proxy.address,
  });

  console.log(await vault.version());

  return vault;
}

describe("Vault", () => {
  it("proxy deployment and verification", async () => {
    let vault = (await deployVaultAndVerifyInTenderly()) as Vault;
    const vaultV2Factory = await ethers.getContractFactory("VaultV2");

    vault = (await upgrades.upgradeProxy(vault, vaultV2Factory, {
      kind: "transparent",
    })) as Vault;

    await vault.deployed();

    await tenderly.verify({
      name: "VaultV2",
      address: await getImplementationAddress(ethers.provider, vault.address),
    });

    console.log(await vault.version());
  });
});
```

hardhat.config.ts

```ts
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";

import * as tdly from "@tenderly/hardhat-tenderly";

tdly.setup({ automaticVerifications: false });

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.18" }],
    overrides: {
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
  networks: {
    tenderly: {
      url: "https://rpc.vnet.tenderly.co/devnet/proxy-verifications/aff78e14-4ed2-4c2a-b840-ec4a1df38467",
    },
  },

  // point to your project
  tenderly: {
    project: "contract-verification",
    username: "nenad",
  },
  mocha: {
    timeout: 5 * 60 * 1000,
  },
};

export default config;
```
