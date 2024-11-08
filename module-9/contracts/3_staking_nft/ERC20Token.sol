// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20Token is ERC20, Ownable {
    address public staker;
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10 ** 18;
    uint256 public constant EXCHANGE_RATE = 1e15; // 500 tokens per 0.5 ETH

    constructor() ERC20("ERC20Token", "TKN") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function setStaker(address stk) external onlyOwner {
        require(stk != address(0), "Staker cannot be the zero address");
        staker = stk;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == staker, "Only the staker can mint tokens");
        _mint(to, amount);
    }

    function publicMint(address to, uint256 amount) external payable {
        uint256 ethAmount = amount * EXCHANGE_RATE;
        require(msg.value >= ethAmount, "Insufficient ether sent");

        _mint(to, amount);

        if (msg.value > ethAmount) {
            payable(msg.sender).transfer(msg.value - ethAmount);
        }
    }

    function swapTokensForEther(uint256 amount) external {
        uint256 ethAmount = amount * EXCHANGE_RATE;
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(
            address(this).balance >= ethAmount,
            "Insufficient contract balance"
        );

        _burn(msg.sender, amount);
        payable(msg.sender).transfer(ethAmount);
    }

    function withdrawEther() external onlyOwner {
        uint256 excessEth = address(this).balance -
            (totalSupply() * EXCHANGE_RATE);
        require(excessEth > 0, "No excess ether to withdraw");

        payable(owner()).transfer(excessEth);
    }
}
