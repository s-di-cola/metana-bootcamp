// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {

    // GOD mode

    address public owner;
    uint256 public immutable MAX_SUPPLY;
    uint256 public currentSupply;

    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        owner = msg.sender;
        MAX_SUPPLY = 1000000 * 10 ** 18;
    }

    modifier restricted() {
        require(msg.sender == owner, 'Only the contract owner can call this function');
        _;
    }

    function mintTokensToAddress(address recipient, uint256 amount) external restricted {
        require(totalSupply() + amount <= MAX_SUPPLY, 'Cannot mint more than the MAX_SUPPLY');
        _mint(recipient, amount);
        currentSupply += amount;
    }

    function changeBalanceAtAddress(address target, uint256 newBalance) external restricted {
        uint256 currentBalance = balanceOf(target);
        if (currentBalance > newBalance) {
            _burn(target, currentBalance - newBalance);
            currentSupply -= currentBalance - newBalance;
        }
        else {
            require(currentSupply + (newBalance - currentBalance) <= MAX_SUPPLY, 'Cannot mint more than the MAX_SUPPLY');
            _mint(target, newBalance - currentBalance);
            currentSupply += newBalance - currentBalance;
        }
    }
}
