// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;


import "./AlchemyTokens.sol";
import "hardhat/console.sol";

contract Forgery {
    AlchemyTokens public immutable alchemyTokens;
    using Strings for uint256;

    constructor() {
        alchemyTokens = new AlchemyTokens();
    }

    // Return the balance of the sender for all tokens
    function getBalances(address _of) external view  returns (uint256[] memory) {
        address[] memory addresses = new address[](7);
        uint256[] memory ids = new uint256[](7);
        for (uint i = 0; i < 7; i++) {
            addresses[i] = _of;
            ids[i] = i;
        }
        return alchemyTokens.balanceOfBatch(addresses, ids);
    }

    function forgeBasicToken(IAlchemyTokens.Token _token, uint256 _amount) external {
        require(_token <= IAlchemyTokens.Token.SILVER, "Can only forge IRON, COPPER, or SILVER");
        console.log("Sender FORGIN: ", msg.sender);
    alchemyTokens.mintBasicToken(msg.sender, _token, _amount);
    }

    function forgeCompoundToken(IAlchemyTokens.Token _token, uint256 _amount) external {
        require(_token > IAlchemyTokens.Token.SILVER && _token <= IAlchemyTokens.Token.RHODIUM, "Invalid compound token");
        alchemyTokens.mintCompoundToken(msg.sender, _token, _amount);
    }

    function burn(IAlchemyTokens.Token _token, uint256 _amount) external {
        alchemyTokens.burn(msg.sender, _token, _amount);
    }

    function trade(IAlchemyTokens.Token _from, IAlchemyTokens.Token _to, uint256 _amount) external {
        require(_to <= IAlchemyTokens.Token.SILVER, "Can only trade to IRON, COPPER, or SILVER");
        require(alchemyTokens.balanceOf(msg.sender, uint256(_from)) >= _amount, "Insufficient balance to trade");

        alchemyTokens.burn(msg.sender, _from, _amount);
        alchemyTokens.mintBasicToken(msg.sender, _to, _amount);
    }

    function getTokenURI(IAlchemyTokens.Token tokenType, uint256 tokenId) external view returns (string memory) {
        return alchemyTokens.getTokenURI(tokenType, tokenId);
    }

    function getTokensMinted(IAlchemyTokens.Token tokenType) external view returns (uint256) {
        return alchemyTokens.getTokensMinted(tokenType);
    }

    function canForgeNow() external view returns (bool) {
        console.log("Can forge now: ", alchemyTokens.lastMinted() + 1 minutes < block.timestamp);
        console.log("Last minted: ", alchemyTokens.lastMinted());
        console.log("Current time: ", block.timestamp);
        uint256 lastMintedPlusOneMinute = alchemyTokens.lastMinted() + 1 minutes;

        if (lastMintedPlusOneMinute > block.timestamp) {
            console.log("Difference: ", lastMintedPlusOneMinute - block.timestamp);
        } else {
            console.log("Difference: 0");
        }
        return alchemyTokens.lastMinted() + 1 minutes < block.timestamp;

    }

    function getLastMintedTime() external view returns (uint256) {
        return alchemyTokens.lastMinted();
    }
}
