// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "./ERC20Token.sol";

contract ERC20ExchangeV2 is ERC20Token {
    // New state variable for V2
    uint256 public exchangeRate;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string memory tokenName,
        string memory tokenSymbol
    ) public override initializer {
        super.initialize(tokenName, tokenSymbol);
    }

    function initializeV2() public reinitializer(2) {
        exchangeRate = 100; // Default exchange rate
    }

    // New function in V2
    function setExchangeRate(uint256 newRate) external {
        require(msg.sender == owner, "Only owner can set exchange rate");
        exchangeRate = newRate;
    }
}
