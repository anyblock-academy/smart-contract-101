//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BinCoin is ERC20 {
    address public tokenA;
    
    uint256 public fundingStartBlock;
    uint256 public fundingEndBlock;
    uint256 public tokenICOCap = 30000 * 10**decimals();
    uint256 public tokenICOMin = 10000 * 10**decimals();
    uint256 public totalTokenSale;
    uint32 public totalInvestor;

    bool public isOpenICO;
    bool public isProcessICO;
    address public founder;

    mapping(uint32 => address) investorIndexes;
    mapping(address => uint256) investorsFunding;

    constructor() ERC20("BinCoin", "BCO") {
        mint(address(this), (100000) * 10**decimals());
        founder = msg.sender;
    }

    function openICO(address _tokenA) external {
        require(msg.sender == founder && !isOpenICO, "OPEN_ICO");
        fundingStartBlock = block.number;
        fundingEndBlock = block.number + 100;
        tokenA = _tokenA;
        isOpenICO = true;
    }

    function buyToken(uint256 amount) external {
        require(isOpenICO &&
                !isProcessICO &&
                block.number <= fundingEndBlock &&
                totalTokenSale + amount <= tokenICOCap,
                "BUY_TOKEN");
        IERC20(tokenA).transferFrom(msg.sender, address(this), amount);

        if (investorsFunding[msg.sender] == 0) {
            investorIndexes[totalInvestor] = msg.sender;
            totalInvestor += 1;
        }

        investorsFunding[msg.sender] += amount;
        totalTokenSale += amount * 1000 / 25; // 1 BCO = 0.025 TokenA
    }

    function processICO() external {
        require(isOpenICO &&
                !isProcessICO &&
                block.number > fundingEndBlock,
                "PROCESS_ICO");

        isProcessICO = true;

        if (totalTokenSale >= tokenICOMin) {
            for(uint32 i; i < totalInvestor; i++) {
                _transfer(address(this),
                          investorIndexes[i],
                          investorsFunding[investorIndexes[i]] * 1000 / 25);
            }
            _transfer(address(this), founder, balanceOf(address(this)));
        }

        IERC20(tokenA).transfer(msg.sender, IERC20(tokenA).balanceOf(address(this)));
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
