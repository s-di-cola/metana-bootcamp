// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts@4.x/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract AirDrop is ERC721, PaymentSplitter, ERC721Enumerable {
    using EnumerableSet for EnumerableSet.AddressSet;

    uint256 public constant MAX_SUPPLY = 100;

    constructor(address[] memory payees, uint256[] memory shares)
    payable
    ERC721("AirDrop", "AD")
    PaymentSplitter(payees, shares)
    {
        require(msg.value == 10 ether, "Need 10 ETH to deploy");
    }

    function mint(uint8 tokenID) external payable {
        require(msg.value == 10 ether, "Need 10 ETH to mint");
        require(totalSupply() < MAX_SUPPLY);
        _safeMint(msg.sender, tokenID);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }
}
