// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MetanaOpensea is ERC721 {
    uint8 public constant MAX_SUPPLY = 10;
    uint8 public tokenSupply = 0;

    constructor() ERC721("MetanaOpenSea", "MOS") {}

    function mint() external {
        require(tokenSupply < MAX_SUPPLY, "Max supply reached");
        _mint(msg.sender, tokenSupply++);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmTc1sYh2z4jYDsqTGWASPd7Nn5YGoZvvP9JF8C7RoAKAm/";
    }
}
