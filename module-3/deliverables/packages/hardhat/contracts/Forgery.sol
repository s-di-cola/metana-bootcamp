// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

import "./AlchemyTokens.sol";

contract Forgery {
	AlchemyTokens public immutable alchemyTokens;
	using Strings for uint256;

	constructor() {
		alchemyTokens = new AlchemyTokens();
	}

	function getBalances(address addr) external view returns (uint256[] memory) {
		address[] memory addresses = new address[](7);
		uint256[] memory ids = new uint256[](7);
		for (uint i = 0; i < 7; i++) {
			addresses[i] = addr;
			ids[i] = i;
		}
		return alchemyTokens.balanceOfBatch(addresses, ids);
	}

	function forgeBasicToken(
		IAlchemyTokens.Token token,
		uint256 amount
	) external {
		require(
			token <= IAlchemyTokens.Token.SILVER,
			"Can only forge IRON, COPPER, or SILVER"
		);
		alchemyTokens.mintBasicToken(msg.sender, token, amount);
	}

	function forgeCompoundToken(
		IAlchemyTokens.Token token,
		uint256 amount
	) external {
		require(
			token > IAlchemyTokens.Token.SILVER &&
				token <= IAlchemyTokens.Token.RHODIUM,
			"Invalid compound token"
		);
		alchemyTokens.mintCompoundToken(msg.sender, token, amount);
	}

	function trade(
		IAlchemyTokens.Token from,
		IAlchemyTokens.Token to,
		uint256 amount
	) external {
		require(
			to <= IAlchemyTokens.Token.SILVER,
			"Can only trade to IRON, COPPER, or SILVER"
		);
		require(
			alchemyTokens.balanceOf(msg.sender, uint256(from)) >= amount,
			"Insufficient balance to trade"
		);

		alchemyTokens.burn(msg.sender, from, amount);
		alchemyTokens.mintBasicToken(msg.sender, to, amount);
	}

	function getTokenURI(
		IAlchemyTokens.Token tokenType,
		uint256 tokenId
	) external view returns (string memory) {
		return alchemyTokens.getTokenURI(tokenType, tokenId);
	}

	function getTokensMinted(
		IAlchemyTokens.Token tokenType
	) external view returns (uint256) {
		return alchemyTokens.getTokensMinted(tokenType);
	}

	function canForgeNow() external view returns (bool) {
		return alchemyTokens.lastMinted() + 1 minutes < block.timestamp;
	}

	function getLastMintedTime() external view returns (uint256) {
		return alchemyTokens.lastMinted();
	}
}
