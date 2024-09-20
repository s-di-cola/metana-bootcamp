// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./ERC721Exchange.sol";
import {ERC20Exchange} from "./ERC20Exchange.sol";

contract Minter {

    // Set the price of the NFT to 10 TEX tokens
    uint256 public constant NFT_PRICE = 10 * 1e18;
    ERC20Exchange private erc20Exchange;
    ERC721Exchange private erc721Exchange;
    address private owner;

    constructor(ERC20Exchange _erc20Exchange) {
        erc20Exchange = _erc20Exchange;
        erc721Exchange = new ERC721Exchange(address(this));
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized");
        _;
    }

    function mint() external {
        //Check if the user has enough TEX tokens to purchase the NFT
        require(erc20Exchange.balanceOf(msg.sender) >= NFT_PRICE, "Insufficient balance");

        // Check if the user has approved the contract to spend TEX tokens
        require(erc20Exchange.allowance(msg.sender, address(this)) >= NFT_PRICE, "Insufficient allowance");

        // Transfer TEX tokens from the user to the contract
        require(erc20Exchange.transferFrom(msg.sender, address(this), NFT_PRICE), "Transfer failed");

        // Mint the NFT and transfer it to the user
        erc721Exchange.mint(msg.sender);
    }


    function withdraw(uint256 _amount) external onlyOwner{
        require(address (this).balance >= _amount, "Insufficient balance");
        require(erc20Exchange.transfer(owner, _amount), "Transfer failed");
    }
}
