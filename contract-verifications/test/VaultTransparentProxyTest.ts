import { getImplementationAddress } from "@openzeppelin/upgrades-core";
import { ethers, tenderly, upgrades } from "hardhat";
import { Vault } from "../typechain-types";

describe("Vault", () => {
  it("transparent upgradable proxy deployment and verification", async () => {
    const VaultFactory = await ethers.getContractFactory("Vault");
    const TokenFactory = await ethers.getContractFactory("TToken");

    const token = await TokenFactory.deploy();
    await token.deployed();

    await tenderly.verify({
      name: "TToken",
      address: token.address,
    });

    let proxy = await upgrades.deployProxy(VaultFactory, [token.address], {
      kind: "transparent",
    });
    await proxy.deployed();

    console.log("Deployed transparent", {
      proxy: proxy.address,
      implementation: await getImplementationAddress(
        ethers.provider,
        proxy.address
      ),
    });

    await tenderly.verify(
      {
        name: "Vault",
        address: await getImplementationAddress(ethers.provider, proxy.address),
      },
      {
        name: "TransparentUpgradeableProxy",
        address: proxy.address,
      }
    );

    console.log(`Vault version before upgrade: ${await proxy.version()}`);

    // upgrade
    const vaultV2Factory = await ethers.getContractFactory("VaultV2");

    proxy = (await upgrades.upgradeProxy(proxy, vaultV2Factory, {
      kind: "transparent",
    })) as Vault;

    await proxy.deployed();

    console.log("Upgraded transparent ", {
      proxy: proxy.address,
      implementation: await getImplementationAddress(
        ethers.provider,
        proxy.address
      ),
    });

    await tenderly.verify({
      name: "VaultV2",
      address: await getImplementationAddress(ethers.provider, proxy.address),
    });

    console.log(`Vault version after upgrade: ${await proxy.version()}`);
  });
});
