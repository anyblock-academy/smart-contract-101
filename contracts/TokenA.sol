//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenA is ERC20 {
    address private owner;

    constructor(
        address _owner,
        string memory _name,
        string memory _symbol,
        uint256 initialAmount
    ) ERC20(_name, _symbol) {
        owner = _owner;
        _mint(msg.sender, initialAmount);
    }

    function mint(uint256 amount) public payable {
        require(msg.sender == owner);

        _mint(owner, amount);
    }
}
