// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../module-1/deliverables/1_ERC20Token.sol";

contract MockERC20Token is ERC20Token {
    constructor(string memory name, string memory symbol) ERC20Token(name, symbol){}

    function transfer(address recipient, uint256 amount) public override pure returns (bool)
    {
        return false;
    }
}
