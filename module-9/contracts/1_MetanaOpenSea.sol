// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";

contract MetanaOpenSea is ERC721Upgradeable {
    uint8 public constant MAX_SUPPLY = 10;
    uint8 public tokenSupply;

    function initialize(string memory symbol) public initializer {
        __ERC721_init("Metana Opensea", symbol);
    }

    function mint() external {
        require(tokenSupply < MAX_SUPPLY, "Max supply reached");
        _mint(msg.sender, tokenSupply++);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmTc1sYh2z4jYDsqTGWASPd7Nn5YGoZvvP9JF8C7RoAKAm/";
    }
}
