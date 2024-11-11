// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./ERC721Token.sol";
import "./ERC20Token.sol";

contract Staker is ERC721HolderUpgradeable, UUPSUpgradeable, OwnableUpgradeable {
    using EnumerableSet for EnumerableSet.UintSet;
    S_ERC20Token private  erc20Token;
    S_ERC721Token private erc721Token;

    uint256 public constant REWARD_CYCLE = 1 days;

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

    function initialize(S_ERC20Token erc20Tkn, S_ERC721Token erc721Tkn) public initializer {
        __ERC721Holder_init();
        __UUPSUpgradeable_init();
        __Ownable_init(_msgSender());
    erc20Token = erc20Tkn;
        erc721Token = erc721Tkn;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function stakeNFT(uint256 tokenId) external {
        stakedNFTs[tokenId][msg.sender] = StakedNFT({
            stakingTimestamp: block.timestamp,
            lastRewardClaimTimestamp: block.timestamp
        });
        require(stakerTokenIds[msg.sender].add(tokenId), "Token already exists");
        erc721Token.safeTransferFrom(msg.sender, address(this), tokenId);
        emit NFTStaked(msg.sender, tokenId);
    }

    function transferStakedNFT(address to, uint256 tokenId) external {
        require(
            stakedNFTs[tokenId][msg.sender].stakingTimestamp != 0,
            "Only the owner can transfer the NFT"
        );

        stakedNFTs[tokenId][to] = stakedNFTs[tokenId][msg.sender];
        delete stakedNFTs[tokenId][msg.sender];
        require(stakerTokenIds[msg.sender].remove(tokenId), "Token not found");
        require(stakerTokenIds[to].add(tokenId), "Token already exists");

        erc721Token.safeTransferFrom(address(this), to, tokenId);
        emit NTFStakedTransferred(to, tokenId);
    }

    function withdrawNFT(uint256 tokenId) external {
        require(
            stakedNFTs[tokenId][msg.sender].stakingTimestamp != 0,
            "Only the owner can withdraw the NFT"
        );

        delete stakedNFTs[tokenId][msg.sender];
        require(stakerTokenIds[msg.sender].remove(tokenId), "Token not found");

        erc721Token.safeTransferFrom(address(this), msg.sender, tokenId);
        emit NFTWithdrawn(msg.sender, tokenId);
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
