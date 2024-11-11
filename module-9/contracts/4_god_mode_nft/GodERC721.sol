//SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract BaseERC721V2 is ERC721Upgradeable, OwnableUpgradeable {

    event ForceTransfer(address indexed from, address indexed to, uint256 indexed tokenId);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public reinitializer(2) {
        __Ownable_init(msg.sender);
    }

    /**
    * @dev Force transfer a token from one address to another
    * @param from The address to transfer the token from
    * @param to The address to transfer the token to
    * @param tokenId The token ID
    */
    function forceTransfer(address from, address to, uint256 tokenId) external onlyOwner {
        _transfer(from, to, tokenId);
        emit ForceTransfer(from, to, tokenId);
    }


    /**
    * @dev Check if the contract is V2
    * @return bool True if the contract is V2
    */
    function isV2() public pure returns (bool) {
        return true;
    }
}
