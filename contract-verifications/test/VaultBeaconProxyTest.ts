import { getImplementationAddressFromBeacon } from "@openzeppelin/upgrades-core";
import { ethers, tenderly, upgrades } from "hardhat";
import { BeaconProxy, UpgradeableBeacon } from "../typechain-types";

describe("Vault", () => {
  it("beacon proxy deployment and verification", async () => {
    const VaultFactory = await ethers.getContractFactory("Vault");
    const TokenFactory = await ethers.getContractFactory("TToken");

    const token = await TokenFactory.deploy();
    await token.deployed();

    await tenderly.verify({
      name: "TToken",
      address: token.address,
    });

    let beacon = (await upgrades.deployBeacon(
      VaultFactory
    )) as UpgradeableBeacon;

    await beacon.deployed();

    let vault = await upgrades.deployBeaconProxy(
      beacon,
      VaultFactory,
      [token.address],
      {
        initializer: "initialize",
      }
    );
    await vault.deployed();

    console.log("Deployed beacon ", {
      proxy: beacon.address,
      implementation: await getImplementationAddressFromBeacon(
        ethers.provider,
        beacon.address
      ),
      beacon: beacon.address,
    });

    await tenderly.verify(
      {
        name: "Vault",
        address: await getImplementationAddressFromBeacon(
          ethers.provider,
          beacon.address
        ),
      },
      {
        name: "UpgradeableBeacon",
        address: beacon.address,
      }
    );

    console.log(
      `Vault version before upgrade: ${await VaultFactory.attach(
        await beacon.implementation()
      ).version()}`
    );

    const vaultV2Factory = await ethers.getContractFactory("VaultV2");

    // upgrade
    vault = await upgrades.deployBeaconProxy(beacon, vaultV2Factory, [
      token.address,
    ]);

    await upgrades.upgradeBeacon(beacon.address, vaultV2Factory, {});

    console.log("Upgraded beacon ", {
      proxy: beacon.address,
      implementation: await getImplementationAddressFromBeacon(
        ethers.provider,
        beacon.address
      ),
      beacon: beacon.address,
    });

    await tenderly.verify({
      name: "VaultV2",
      address: await getImplementationAddressFromBeacon(
        ethers.provider,
        beacon.address
      ),
    });

    console.log(
      `Vault version after upgrade: ${await VaultFactory.attach(
        await beacon.implementation()
      ).version()}`
    );
  });
});
