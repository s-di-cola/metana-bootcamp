// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.26;

import "@openzeppelin/contracts/utils/Multicall.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract AirDrop is ERC721, Multicall {
    uint256 public constant MAX_SUPPLY = 1000;

    constructor() ERC721("AirDrop", "AD") {
        uint256 currentSupply;
        while (currentSupply < MAX_SUPPLY) {
            _mint(msg.sender, currentSupply);
            currentSupply++;
        }
    }

    function getTransferData(address to, uint256 tokenID)
    external
    view
    returns (bytes memory)
    {
        return
            abi.encodeWithSelector(
            IERC721.transferFrom.selector,
            msg.sender,
            to,
            tokenID
        );
    }
}
