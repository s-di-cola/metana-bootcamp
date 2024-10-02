// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {ERC20Token} from "../../../module-1/deliverables/1_ERC20Token.sol";

contract ERC20Exchange is ERC20Token {
    constructor() ERC20Token("TokenExchange", "TEX") {}
}
