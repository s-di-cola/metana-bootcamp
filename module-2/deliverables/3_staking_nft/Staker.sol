// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./ERC721Token.sol";
import "./ERC20Token.sol";


contract Staker is IERC721Receiver {
    using EnumerableSet for EnumerableSet.UintSet;
    ERC20Token private immutable erc20Token;
    ERC721Token private immutable erc721Token;

    uint256 public constant  REWARD_CYCLE = 1 days;

    struct StakedNFT {
        uint256 stakingTimestamp;
        uint256 lastRewardClaimTimestamp;
    }

    mapping(uint256 => mapping(address => StakedNFT)) public stakedNFTs;
    mapping(address => EnumerableSet.UintSet) private stakerTokenIds;

    event NFTStaked(address indexed staker, uint256 tokenId);
    event NFTWithdrawn(address indexed staker, uint256 tokenId);
    event RewardClaimed(address indexed staker, uint256 amount);
    event NTFStakedTransferred(address indexed staker, uint256 tokenId);

    constructor(ERC20Token _erc20Token, ERC721Token _erc721Token) {
        erc20Token = _erc20Token;
        erc721Token = _erc721Token;
    }

    function stakeNFT(uint256 _tokenId) external {
        erc721Token.safeTransferFrom(msg.sender, address(this), _tokenId);
        stakedNFTs[_tokenId][msg.sender] = StakedNFT({
            stakingTimestamp: block.timestamp,
            lastRewardClaimTimestamp: block.timestamp
        });
        stakerTokenIds[msg.sender].add(_tokenId);

        emit NFTStaked(msg.sender, _tokenId);
    }

    function transferStakedNFT(address _to, uint256 _tokenId) external {
        require(stakedNFTs[_tokenId][msg.sender].stakingTimestamp != 0, "Only the owner can transfer the NFT");

        erc721Token.safeTransferFrom(address(this), _to, _tokenId);

        stakedNFTs[_tokenId][_to] = stakedNFTs[_tokenId][msg.sender];
        delete stakedNFTs[_tokenId][msg.sender];

        stakerTokenIds[msg.sender].remove(_tokenId);
        stakerTokenIds[_to].add(_tokenId);

        emit NTFStakedTransferred(_to, _tokenId);
    }

    function withdrawNFT(uint256 _tokenId) external {
        require(
            stakedNFTs[_tokenId][msg.sender].stakingTimestamp != 0,
            "Only the owner can withdraw the NFT"
        );
        erc721Token.safeTransferFrom(address(this), msg.sender, _tokenId);

        delete stakedNFTs[_tokenId][msg.sender];
        stakerTokenIds[msg.sender].remove(_tokenId);

        emit NFTWithdrawn(msg.sender, _tokenId);
    }

    function withdrawReward() external {
        uint256 totalReward = 0;
        uint256 stakedTokenCount = stakerTokenIds[msg.sender].length();
        for (uint256 i = 0; i < stakedTokenCount; i++) {
            uint256 stakedTokenId = stakerTokenIds[msg.sender].at(i);
            StakedNFT storage nftStake = stakedNFTs[stakedTokenId][msg.sender];
            uint256 stakingDuration = block.timestamp -
                            nftStake.lastRewardClaimTimestamp;
            totalReward += calculateReward(stakingDuration);
            nftStake.lastRewardClaimTimestamp = block.timestamp;
        }

        require(totalReward > 0, "No rewards to claim");
        erc20Token.mint(msg.sender, totalReward * 1e18);

        emit RewardClaimed(msg.sender, totalReward);
    }

    function calculateReward(uint256 duration) internal pure returns (uint256) {
        return (duration * 10 * 1e18) / 1 days;
    }

    function onERC721Received(
        address,
        address _from,
        uint256 _tokenId,
        bytes memory
    ) public override returns (bytes4) {
        stakedNFTs[_tokenId][_from].stakingTimestamp = block.timestamp;
        return this.onERC721Received.selector;
    }
}
