// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./ERC721Exchange.sol";
import {ERC20Exchange} from "./ERC20Exchange.sol";

contract Minter {
    uint256 public constant NFT_PRICE = 10 * 1e18;
    ERC20Exchange public immutable erc20Exchange;
    ERC721Exchange public immutable erc721Exchange;
    address public owner;

    constructor(address _erc20Exchange, address _erc721Exchange) {
        require(_erc20Exchange != address(0), "ERC20Exchange address cannot be zero");
        require(_erc721Exchange != address(0), "ERC721Exchange address cannot be zero");
        erc20Exchange = ERC20Exchange(_erc20Exchange);
        erc721Exchange = ERC721Exchange(_erc721Exchange);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function mint() external {
        require(erc20Exchange.balanceOf(msg.sender) >= NFT_PRICE, "Insufficient balance");
        require(erc20Exchange.allowance(msg.sender, address(this)) >= NFT_PRICE, "Insufficient allowance");
        require(erc20Exchange.transferFrom(msg.sender, address(this), NFT_PRICE), "Transfer failed");
        erc721Exchange.mint(msg.sender);
    }

    function withdrawTEX(uint256 amount) external onlyOwner {
        require(erc20Exchange.balanceOf(address(this)) >= amount, "Insufficient TEX balance");
        require(erc20Exchange.transfer(owner, amount), "Transfer failed");
    }
}
