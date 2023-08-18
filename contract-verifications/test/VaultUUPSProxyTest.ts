import { getImplementationAddress } from "@openzeppelin/upgrades-core";
import { ethers, tenderly, upgrades } from "hardhat";
import { Vault } from "../typechain-types";

describe("UUPSProxy", () => {
  it("deployed, upgraded, and verified", async () => {
    const VaultFactory = await ethers.getContractFactory("Vault");
    const TokenFactory = await ethers.getContractFactory("TToken");

    const token = await TokenFactory.deploy();
    await token.deployed();

    let proxy = await upgrades.deployProxy(VaultFactory, [token.address], {
      kind: "uups",
    });

    await proxy.deployed();

    console.log("Deployed UUPS ", {
      proxy: proxy.address,
      implementation: await getImplementationAddress(
        ethers.provider,
        proxy.address
      ),
    });

    await tenderly.verify(
      // verify the implementation
      {
        name: "Vault",
        address: await getImplementationAddress(ethers.provider, proxy.address),
      },
      // verify the proxy instance
      {
        name: "ERC1967Proxy",
        address: proxy.address,
      },
      // verify dependencies
      {
        name: "TToken",
        address: token.address,
      }
    );

    console.log(`Vault version: ${await proxy.version()}`);
    console.log("=======================================");
    // upgrade
    const vaultV2Factory = await ethers.getContractFactory("VaultV2");
    proxy = (await upgrades.upgradeProxy(proxy, vaultV2Factory, {
      kind: "uups",
    })) as Vault;

    await proxy.deployed();

    console.log("Upgraded UUPS ", {
      proxy: proxy.address,
      implementation: await getImplementationAddress(
        ethers.provider,
        proxy.address
      ),
    });

    // only have to verify new implementation
    await tenderly.verify({
      name: "VaultV2",
      address: await getImplementationAddress(ethers.provider, proxy.address),
    });

    console.log(`Vault version after upgrade: ${await proxy.version()}`);
  });
});
