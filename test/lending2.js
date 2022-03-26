const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lending2", () => {
  let borrower, lender, Lending2, lending2, TokenA, tokenA, TokenB, tokenB;
  before(async () => {
    [borrower, lender] = await ethers.getSigners();
  });

  it("Should deploy TokenA and TokenB", async () => {
    TokenA = await ethers.getContractFactory("TokenA");
    tokenA = await TokenA.connect(lender).deploy(
      lender.address,
      "TokenA",
      "TokenA",
      100000
    );

    await tokenA.connect(lender).transfer(borrower.address, 1000);

    TokenB = await ethers.getContractFactory("TokenB");
    tokenB = await TokenB.connect(borrower).deploy(
      lender.address,
      "TokenB",
      "TokenB",
      500000
    );

    expect(+(await tokenA.balanceOf(lender.address))).to.equal(99000);
    expect(+(await tokenB.balanceOf(borrower.address))).to.equal(500000);
  });

  it("Should init lending2 contract correctly", async () => {
    Lending2 = await ethers.getContractFactory("Lending2");
    lending2 = await Lending2.deploy(
      tokenA.address,
      tokenB.address,
      borrower.address,
      lender.address,
      10000,
      50,
      15000,
      1000
    );

    const tokenABorrowerBalance0 = +(await tokenA.balanceOf(borrower.address));
    const tokenALenderBalance0 = +(await tokenA.balanceOf(lender.address));
    const tokenBBorrowerBalance0 = +(await tokenB.balanceOf(borrower.address));
    const tokenBLenderBalance0 = +(await tokenB.balanceOf(lender.address));

    await tokenA.connect(lender).approve(lending2.address, 10000);
    await lending2.connect(lender).lenderDepositFund();

    await tokenB.connect(borrower).approve(lending2.address, 150000);
    await lending2.connect(borrower).borrowerClaimFund();

    const tokenABorrowerBalance1 = +(await tokenA.balanceOf(borrower.address));
    const tokenALenderBalance1 = +(await tokenA.balanceOf(lender.address));
    const tokenBBorrowerBalance1 = +(await tokenB.balanceOf(borrower.address));
    const tokenBLenderBalance1 = +(await tokenB.balanceOf(lender.address));

    expect(tokenALenderBalance1 - tokenALenderBalance0).to.equal(-10000);
    expect(tokenABorrowerBalance1 - tokenABorrowerBalance0).to.equal(10000);
    expect(tokenBBorrowerBalance1 - tokenBBorrowerBalance0).to.equal(-15000);


    // await ethers.provider.send("evm_increaseTime", [800]);
    // await tokenA.connect(borrower).approve(lending2.address, 10050);
    // await lending2.connect(borrower).borrowerPaid();


    await ethers.provider.send("evm_increaseTime", [8600]);
    await lending2.connect(lender).lenderRedeemFund();

    const tokenABorrowerBalance2 = +(await tokenA.balanceOf(borrower.address));
    const tokenALenderBalance2 = +(await tokenA.balanceOf(lender.address));
    const tokenBBorrowerBalance2 = +(await tokenB.balanceOf(borrower.address));
    const tokenBLenderBalance2 = +(await tokenB.balanceOf(lender.address));

    // expect(tokenALenderBalance2 - tokenALenderBalance0).to.equal(50);
    // expect(tokenABorrowerBalance2 - tokenABorrowerBalance0).to.equal(-50);
    // expect(tokenBBorrowerBalance2 - tokenBBorrowerBalance0).to.equal(0);

    expect(tokenALenderBalance2 - tokenALenderBalance0).to.equal(-10000);
    expect(tokenABorrowerBalance2 - tokenABorrowerBalance0).to.equal(10000);
    expect(tokenBBorrowerBalance2 - tokenBBorrowerBalance0).to.equal(-15000);
    expect(tokenBLenderBalance2 - tokenBLenderBalance0).to.equal(15000);
  });
});
