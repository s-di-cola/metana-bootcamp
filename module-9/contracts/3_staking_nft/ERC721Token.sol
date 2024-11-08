// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./ERC20Token.sol";

contract ERC721Token is ERC721, Ownable {
    uint256 public immutable MAX_SUPPLY;
    uint256 public immutable NFT_PRICE;
    uint256 public totalSupply;
    ERC20Token public immutable paymentToken;

    constructor(
        uint256 maxSupply,
        uint256 nftPrice,
        ERC20Token _paymentToken
    ) ERC721("ERC721Token", "NKN") Ownable(msg.sender) {
        MAX_SUPPLY = maxSupply;
        NFT_PRICE = nftPrice;
        paymentToken = _paymentToken;
    }

    function mint(uint256 tokenId) external {
        require(totalSupply + 1 < MAX_SUPPLY, "Too many tokens");
        totalSupply++;
        require(
            paymentToken.transferFrom(msg.sender, address(this), NFT_PRICE),
            "Transfer failed"
        );
        _safeMint(msg.sender, tokenId);
    }
}
