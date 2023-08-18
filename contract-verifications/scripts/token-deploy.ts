import { BigNumber } from "ethers";
import { ethers, tenderly } from "hardhat";

async function main() {
  const TokenFactory = await ethers.getContractFactory("TToken");
  const token = await TokenFactory.deploy();

  await token.deployed();

  const [_, secondSigner] = await ethers.getSigners();

  await token.mint(secondSigner.address, BigNumber.from("1000"));

  await tenderly.verify({
    name: "TToken",
    address: token.address,
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
