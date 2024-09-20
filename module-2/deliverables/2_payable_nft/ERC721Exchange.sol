// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC721Exchange is ERC721 {

    uint256 private _tokenIdCounter;
    address private immutable minter;

    constructor(address _minter)ERC721("ERC721Exchange", "ERC721X"){
        minter = _minter;
    }

    modifier onlyMinter(){
        require(msg.sender == minter, "Only the minter can call this function");
        _;
    }

    function mint(address _to) external onlyMinter returns (uint256){
        _safeMint(_to, _tokenIdCounter++);
        return _tokenIdCounter;
    }

}
