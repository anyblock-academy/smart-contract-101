const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lending1", () => {
  let borrower, lender, Lending1, lending1;
  before(async () => {
    [borrower, lender] = await ethers.getSigners();
  });

  it("Should init lending1 contract correctly", async () => {
    Lending1 = await ethers.getContractFactory("Lending1");

    lending1 = await Lending1.deploy(
      borrower.address,
      lender.address,
      10000,
      50
    );

    // console.log("Contract:", lending1.address);

    const balance0 = +(await borrower.getBalance());
    await lending1.connect(borrower).borrowerSign();
    const balance1 = +(await borrower.getBalance());
    // console.log("Borrower Balance:", balance0, balance1, balance0 - balance1);

    await lending1.connect(lender).lenderSign();

    // console.log("Borrower:", borrower.address);
    // console.log("Lender:", lender.address);

    expect(await lending1.getLoan()).to.equal(10050);
    expect(await lending1.borrower()).to.equal(borrower.address);
    expect(await lending1.lender()).to.equal(lender.address);
    expect(await lending1.isBorrowerSign()).to.equal(true);
    expect(await lending1.isLenderSign()).to.equal(true);

    // console.log(await lending1.getLoan());
    // console.log(await lending1.connect(borrower).borrowerSign());
  });
});
