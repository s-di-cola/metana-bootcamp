// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";

contract AirDrop is ERC721 {
    bytes32 public immutable markleRoot;
    mapping(address => bool) public claimed;
    using BitMaps for BitMaps.BitMap;

    BitMaps.BitMap private claimedBitMap;

    event GasUsed(
        uint256 gasBeforeMapping,
        uint256 gasAfterMapping,
        uint256 gasUsed
    );

    constructor(bytes32 root) ERC721("AirDrop", "AD") {
        markleRoot = root;
    }

    function claimWithMap(uint256 tokenId, bytes32[] memory proof) public {
        uint256 gasBeforeMapping = gasleft();

        require(!claimed[msg.sender], "Already claimed");
        bytes32 leaf = keccak256(
            bytes.concat(keccak256(abi.encode(msg.sender, tokenId)))
        );
        require(MerkleProof.verify(proof, markleRoot, leaf), "Invalid proof");

        claimed[msg.sender] = true;

        uint256 gasAfterMapping = gasleft();
        uint256 gasUsed = gasBeforeMapping - gasAfterMapping;
        emit GasUsed(gasBeforeMapping, gasAfterMapping, gasUsed);

        _safeMint(msg.sender, tokenId);
    }

    function claimWithBitMap(uint256 tokenId, bytes32[] memory proof) public {
        uint256 gasBeforeMapping = gasleft();

        require(!claimedBitMap.get(tokenId), "Already claimed");
        bytes32 leaf = keccak256(
            bytes.concat(keccak256(abi.encode(msg.sender, tokenId)))
        );
        require(MerkleProof.verify(proof, markleRoot, leaf), "Invalid proof");

        claimedBitMap.setTo(tokenId, true);

        uint256 gasAfterMapping = gasleft();
        uint256 gasUsed = gasBeforeMapping - gasAfterMapping;
        emit GasUsed(gasBeforeMapping, gasAfterMapping, gasUsed);

        _safeMint(msg.sender, tokenId);
    }
}
