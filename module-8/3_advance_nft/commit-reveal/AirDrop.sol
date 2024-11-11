// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";

contract AirDrop is ERC721 {
    struct Commitment {
        bool isRevealed;
        bytes32 commit;
        uint256 block;
    }

    using BitMaps for BitMaps.BitMap;
    uint256 public constant MAX_SUPPLY = 1000;
    mapping(address => Commitment) public commitments;
    uint256 public totalSupply;
    BitMaps.BitMap private claimedBitMap;

    event TokenMinted(address indexed to, uint256 indexed tokenId);
    event Committed(address indexed user, bytes32 commitment);

    constructor() ERC721("AirDrop", "AD") {}

    function commit(bytes32 payload) external {
        require(commitments[msg.sender].commit == 0, "Already committed");
        commitments[msg.sender] = Commitment({
            isRevealed: false,
            commit: payload,
            block: block.number
        });
        emit Committed(msg.sender, payload);
    }

    function reveal(bytes32 secret) external {
        require(commitments[msg.sender].commit != 0, "Not committed");
        require(!commitments[msg.sender].isRevealed, "Already revealed");
        require(
            keccak256(abi.encodePacked(msg.sender, secret)) ==
            commitments[msg.sender].commit,
            "Invalid secret"
        );
        require(
            block.number - commitments[msg.sender].block >= 10,
            "Not enough blocks passed"
        );
        require(totalSupply < MAX_SUPPLY, "Max supply reached");

        commitments[msg.sender].isRevealed = true;
        uint256 tokenId = uint256(
            keccak256(
                abi.encodePacked(
                    msg.sender,
                    secret,
                    blockhash(commitments[msg.sender].block)
                )
            )
        ) % MAX_SUPPLY;

        while (claimedBitMap.get(tokenId)) {
            tokenId = (tokenId + 1) % MAX_SUPPLY;
        }
        claimedBitMap.setTo(tokenId, true);
        _safeMint(msg.sender, tokenId);
        totalSupply += 1;

        emit TokenMinted(msg.sender, tokenId);
    }
}

contract Utils {
    function calculateCommit(bytes32 secret) external view returns (bytes32) {
        return keccak256(abi.encodePacked(msg.sender, secret));
    }
}
