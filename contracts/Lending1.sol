//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Lending1 {
    address public borrower;
    address public lender;
    uint256 public loanValue;
    uint256 public interest;
    bool public isBorrowerSign;
    bool public isLenderSign;

    constructor(address _borrower, address _lender, uint256 _loanValue, uint256 _interest) {
        borrower = _borrower;
        lender = _lender;
        loanValue = _loanValue;
        interest = _interest;
        isBorrowerSign = false;
        isLenderSign = false;
    }

    function borrowerSign() public {
        require(msg.sender == borrower, "NO PERMISSION TO SIGN");
        isBorrowerSign = true;
    }

    function lenderSign() public {
        require(msg.sender == lender, "NO PERMISSION TO SIGN");
        isLenderSign = true;
    }

    function getLoan() public view returns (uint256) {
        return loanValue + interest;
    }
}
