// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./AlchemyTokens.sol";


contract Forgery {
    AlchemyTokens public immutable alchemyTokens;
    mapping(uint256 => function(address, uint256) external) private minter;

    constructor() {
        alchemyTokens = new AlchemyTokens();
        minter[uint256(IAlchemyTokens.Token.IRON)] = alchemyTokens.mintIron;
        minter[uint256(IAlchemyTokens.Token.COPPER)] = alchemyTokens.mintCopper;
        minter[uint256(IAlchemyTokens.Token.SILVER)] = alchemyTokens.mintSilver;
        minter[uint256(IAlchemyTokens.Token.GOLD)] = alchemyTokens.mintGold;
        minter[uint256(IAlchemyTokens.Token.PLATINUM)] = alchemyTokens.mintPlatinum;
        minter[uint256(IAlchemyTokens.Token.PALLADIUM)] = alchemyTokens.mintPalladium;
        minter[uint256(IAlchemyTokens.Token.RHODIUM)] = alchemyTokens.mintRhodium;
    }

    function forgeIron(uint256 _amount) external {
        alchemyTokens.mintIron(msg.sender, _amount);
    }

    function forgeCopper(uint256 _amount) external {
        alchemyTokens.mintCopper(msg.sender, _amount);
    }

    function forgeSilver(uint256 _amount) external {
        alchemyTokens.mintSilver(msg.sender, _amount);
    }

    function forgeGold(uint256 _amount) external {
        alchemyTokens.mintGold(msg.sender, _amount);
    }

    function forgePlatinum(uint256 _amount) external {
        alchemyTokens.mintPlatinum(msg.sender, _amount);
    }

    function forgePalladium(uint256 _amount) external {
        alchemyTokens.mintPalladium(msg.sender, _amount);
    }

    function forgeRhodium(uint256 _amount) external {
        alchemyTokens.mintRhodium(msg.sender, _amount);
    }

    function burnPlatinum(uint256 _amount) external {
        require(alchemyTokens.balanceOf(msg.sender, uint256(IAlchemyTokens.Token.PLATINUM)) >= _amount, "Insufficient balance");
        alchemyTokens.burn(msg.sender, uint256(IAlchemyTokens.Token.PLATINUM), _amount);
    }

    function burnPalladium(uint256 _amount) external {
        require(alchemyTokens.balanceOf(msg.sender, uint256(IAlchemyTokens.Token.PALLADIUM)) >= _amount, "Insufficient balance");
        alchemyTokens.burn(msg.sender, uint256(IAlchemyTokens.Token.PALLADIUM), _amount);
    }

    function burnRhodium(uint256 _amount) external {
        require(alchemyTokens.balanceOf(msg.sender, uint256(IAlchemyTokens.Token.RHODIUM)) >= _amount, "Insufficient balance");
        alchemyTokens.burn(msg.sender, uint256(IAlchemyTokens.Token.RHODIUM), _amount);
    }

    function trade(uint256 _from, uint256 _to, uint256 _amount) external {
        require(_from <= uint256(IAlchemyTokens.Token.SILVER), "Can only trade IRON, COPPER, or SILVER");
        require(_to < uint256(IAlchemyTokens.Token.RHODIUM), "Invalid target token");
        // This check is for future-proofing. Currently, all restricted tokens have IDs > SILVER,
        // but this ensures the function remains secure if token IDs or restrictions change.
        require(!alchemyTokens.isRestricted(_from), "Cannot trade to restricted tokens");

        require(alchemyTokens.balanceOf(msg.sender, _from) >= _amount, "Insufficient balance to trade");
        alchemyTokens.burn(msg.sender, _from, _amount);
        minter[_to](msg.sender, _amount);
    }


    modifier withinTokenRange(uint256 _tokenId) {
        require(_tokenId >= uint256(IAlchemyTokens.Token.IRON) && _tokenId <= uint256(IAlchemyTokens.Token.RHODIUM), "Token ID out of range");
        _;
    }

    function isTokenRestricted(uint256 _tokenId) external view withinTokenRange(_tokenId) returns (bool) {
        return alchemyTokens.isRestricted(_tokenId);
    }

    function checkBalances() external view returns (uint256[] memory) {
        uint256 tokenCount = uint256(type(IAlchemyTokens.Token).max) + 1;
        address[] memory addresses = new address[](tokenCount);
        uint256[] memory ids = new uint256[](tokenCount);

        for (uint256 i = 0; i < tokenCount; i++) {
            addresses[i] = msg.sender;
            ids[i] = i;
        }

        return alchemyTokens.balanceOfBatch(addresses, ids);
    }

    function checkBalance(uint256 _tokenId) external view withinTokenRange(_tokenId) returns (uint256){
        return alchemyTokens.balanceOf(msg.sender, _tokenId);
    }

    function canForgeNow() external view returns (bool){
        return alchemyTokens.lastMinted() + 1 minutes < block.timestamp;
    }

    function getLastMintedTime() external view returns (uint256){
        return alchemyTokens.lastMinted();
    }
}
