import { ethers, tenderly } from "hardhat";
import { TToken } from "../typechain-types";
import { BigNumber } from "ethers";
import { expect } from "chai";

describe("TToken", async () => {
  let token: TToken;
  beforeEach(async () => {
    const TokenFactory = await ethers.getContractFactory("TToken");
    token = await TokenFactory.deploy();

    await token.deployed();

    await tenderly.verify({
      name: "TToken",
      address: token.address,
    });
  });

  it("mints", async () => {
    const [_, secondSigner] = await ethers.getSigners();

    await token.mint(secondSigner.address, BigNumber.from("1000"));

    expect(await token.balanceOf(secondSigner.address)).to.eq(
      BigNumber.from("1000")
    );
  });
});
