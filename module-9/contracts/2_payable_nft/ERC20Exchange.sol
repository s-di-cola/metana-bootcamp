// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "./ERC20Token.sol";

contract ERC20Exchange is ERC20Token {
    constructor() ERC20Token("TokenExchange", "TEX") {}
}
