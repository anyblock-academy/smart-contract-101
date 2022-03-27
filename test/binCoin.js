const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BinCoin", () => {
  let root,
    user1,
    user2,
    user3,
    user4,
    founder,
    TokenA,
    tokenA,
    BinCoin,
    binCoin;

  before(async () => {
    [root, user1, user2, user3, user4, founder] = await ethers.getSigners();
  });

  it("Should deploy TokenA and distributed", async () => {
    TokenA = await ethers.getContractFactory("TokenA");
    tokenA = await TokenA.connect(root).deploy(
      root.address,
      "TokenA",
      "TokenA",
      "0x152D02C7E14AF6800000" // 100000.00
    );

    await tokenA.connect(root).transfer(user1.address, "0x21E19E0C9BAB2400000"); // 10000.00
    await tokenA.connect(root).transfer(user2.address, "0x21E19E0C9BAB2400000");
    await tokenA.connect(root).transfer(user3.address, "0x21E19E0C9BAB2400000");
    await tokenA.connect(root).transfer(user4.address, "0x21E19E0C9BAB2400000");

    expect(await tokenA.totalSupply()).to.equal("0x152D02C7E14AF6800000");
  });

  it("Should deploy BinCoin and OpenICO", async () => {
    BinCoin = await ethers.getContractFactory("BinCoin");
    binCoin = await BinCoin.connect(founder).deploy();

    expect(await binCoin.totalSupply()).to.equal("0x152D02C7E14AF6800000");
    expect(await binCoin.founder()).to.equal(founder.address);

    await binCoin.connect(founder).openICO(tokenA.address);

    await tokenA
      .connect(user1)
      .approve(binCoin.address, "0x1043561A8829300000");
    await tokenA.connect(user2).approve(binCoin.address, "0xAD78EBC5AC6200000");
    await tokenA.connect(user3).approve(binCoin.address, "0x56BC75E2D63100000");
    await binCoin.connect(user1).buyToken("0x1043561A8829300000"); // 300.00 TokenA
    await binCoin.connect(user2).buyToken("0xAD78EBC5AC6200000"); // 200.00 TokenA
    await binCoin.connect(user3).buyToken("0x56BC75E2D63100000"); // 100.00 TokenA

    expect(await tokenA.balanceOf(user1.address)).to.equal(
      "0x20DD68AAF3289100000"
    ); // 9700.00 TokenA
    expect(await binCoin.balanceOf(user1.address)).to.equal("0"); // 0 BinCoin

    // User 4: Cannot buy, Exceed Maximum Cap
    await tokenA.connect(user4).approve(binCoin.address, "0x56BC75E2D63100000");
    await expect(binCoin.connect(user4).buyToken("0x21E19E0C9BAB2400000")).to.be
      .reverted; // 10000.00 TokenA

    const blockNumber0 = await ethers.provider.getBlockNumber();
    for (let i = 0; i < 100; i++) {
      await ethers.provider.send("evm_increaseTime", [60]);
      await ethers.provider.send("evm_mine");
    }
    const blockNumber1 = await ethers.provider.getBlockNumber();
    expect(blockNumber1 - blockNumber0).to.equal(100);

    await binCoin.connect(founder).processICO();

    expect(await binCoin.balanceOf(user1.address)).to.equal(
      "0x28A857425466F800000"
    ); // 12000 BinCoin
    expect(await binCoin.balanceOf(user2.address)).to.equal(
      "0x1B1AE4D6E2EF5000000"
    ); // 8000 BinCoin
    expect(await binCoin.balanceOf(user3.address)).to.equal(
      "0xD8D726B7177A800000"
    ); // 4000 BinCoin
    expect(await binCoin.balanceOf(founder.address)).to.equal(
      "0x1017F7DF96BE17800000"
    ); // 76000 BinCoin

    expect(await tokenA.balanceOf(founder.address)).to.equal(
      "0x2086AC351052600000"
    ); // 6000 BinCoin
  });
});
