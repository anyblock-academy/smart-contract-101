//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Lending2 {
    struct LendingInfo {
        address tokenA;
        address tokenB;
        address borrower;
        address lender;
        uint256 loanValue;
        uint256 interest;
        uint256 collateralValue;
        uint256 lendingBlock;
        uint256 paymentPeriod;
        bool isLenderDeposit;
        bool isBorrowerClaimFund;
        bool isBorrowerPaidFund;
    }

    LendingInfo public info;
        
    constructor(
        address _tokenA,
        address _tokenB,
        address _borrower,
        address _lender,
        uint256 _loanValue,
        uint256 _interest,
        uint256 _collateralValue,
        uint32 _paymentPeriod
    ) {
        info.tokenA = _tokenA;
        info.tokenB = _tokenB;
        info.borrower = _borrower;
        info.lender = _lender;
        info.loanValue = _loanValue;
        info.interest = _interest;
        info.collateralValue = _collateralValue;
        info.paymentPeriod = _paymentPeriod;
        info.isLenderDeposit = false;
    }

    function lenderDepositFund() external {
        require(msg.sender == info.lender, "NO PERMISSION");
        IERC20(info.tokenA).transferFrom(msg.sender, address(this), info.loanValue);
        info.isLenderDeposit = true;
    }

    function borrowerClaimFund() external {
        require(msg.sender == info.borrower && info.isLenderDeposit, "NO PERMISSION");
        IERC20(info.tokenB).transferFrom(msg.sender, address(this), info.collateralValue);
        IERC20(info.tokenA).transfer(info.borrower, info.loanValue);
        info.lendingBlock = block.timestamp;
        info.isBorrowerClaimFund = true;
    }

    function borrowerPaid() external {
        require(msg.sender == info.borrower &&
                !info.isBorrowerPaidFund &&
                block.timestamp <= info.lendingBlock + info.paymentPeriod,
                "NO PERMISSION");
        IERC20(info.tokenA).transferFrom(msg.sender, info.lender, info.loanValue + info.interest);
        IERC20(info.tokenB).transfer(info.borrower, info.collateralValue);
        info.isBorrowerPaidFund = true;
    }

    function lenderRedeemFund() external {
        require(msg.sender == info.lender &&
                !info.isBorrowerPaidFund &&
                block.timestamp > info.lendingBlock + info.paymentPeriod,
                "NO PERMISSION");
        IERC20(info.tokenB).transferFrom(address(this), info.lender, info.collateralValue);
    }

    function getLoan() public view returns (uint256) {
        return info.loanValue + info.interest;
    }
}
