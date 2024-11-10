//SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";

contract BaseERC721 is ERC721Upgradeable {
    function initialize(string memory name, string memory symbol) public initializer {
        __ERC721_init(name, symbol);
    }
}
