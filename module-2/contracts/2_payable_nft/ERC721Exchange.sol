// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC721Exchange is ERC721 {
    uint256 private _tokenIdCounter;
    address public tokenMinter;
    address public owner;

    constructor() ERC721("ERC721Exchange", "ERC721X") {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier onlyMinter() {
        require(msg.sender == tokenMinter, "Only the minter can call this function");
        _;
    }

    function setMinter(address tknMinter) external onlyOwner {
        require(tknMinter != address(0), "Minter address cannot be zero");
        tokenMinter = tknMinter;
    }

    function mint(address to) external onlyMinter returns (uint256) {
        _safeMint(to, _tokenIdCounter++);
        return _tokenIdCounter;
    }

    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter;
    }
}
