// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "./ERC20Token.sol";

contract ERC20Exchange is ERC20Token {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string memory tokenName,
        string memory tokenSymbol
    ) public override initializer {
        super.initialize(tokenName, tokenSymbol);
        // Add any ERC20Exchange specific initialization here
    }
}
