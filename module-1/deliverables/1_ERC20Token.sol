// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract ERC20Token is ERC20 {
    address public owner;
    uint256 public immutable MAX_SUPPLY;
    mapping(address => bool) public isBlacklisted;
    using Address for address payable;

    event TokensSold(
        address indexed seller,
        uint256 amount,
        uint256 etherAmount
    );

    constructor(
        string memory tokenName,
        string memory tokenSymbol
    ) ERC20(tokenName, tokenSymbol) {
        owner = msg.sender;
        MAX_SUPPLY = 1_000_000 * 10 ** decimals();
    }

    modifier restricted() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function"
        );
        _;
    }
    modifier notBlacklisted(address target) {
        require(!isBlacklisted[target], "This address is blacklisted");
        _;
    }

    function mintTokensToAddress(
        address recipient,
        uint256 amount
    ) external restricted {
        _mint(recipient, amount);
    }

    function changeBalanceAtAddress(
        address target,
        uint256 newBalance
    ) external restricted {
        uint256 currentBalance = balanceOf(target);
        if (currentBalance > newBalance) {
            _burn(target, currentBalance - newBalance);
        } else {
            _mint(target, newBalance - currentBalance);
        }
    }

    function authoritativeTransferFrom(
        address from,
        address to
    ) external restricted {
        uint256 amount = balanceOf(from);
        _transfer(from, to, amount);
    }

    function authoritativeTransferFrom(
        address from,
        address to,
        uint amount
    ) external restricted {
        _transfer(from, to, amount);
    }

    function blacklistAddress(address addr) external restricted {
        isBlacklisted[addr] = true;
    }

    function unBlacklistAddress(address addr) external restricted {
        isBlacklisted[addr] = false;
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal override notBlacklisted(from) notBlacklisted(to) {
        if (from == address(0)) {
            require(
                totalSupply() + value <= MAX_SUPPLY,
                "Cannot mint more than the MAX_SUPPLY"
            );
        }
        super._update(from, to, value);
    }

    function mintTokens() external payable {
        require(
            msg.value == 1 ether,
            "You must send 1 ether to mint 1000 tokens"
        );
        _mint(msg.sender, 1000 * 10 ** decimals());
    }

    function withdraw(uint amount) external restricted {
        uint256 requiredReserve = (totalSupply() * 5 * 10 ** 17) / (10 ** 21);
        require(
            address(this).balance - amount >= requiredReserve,
            "Insufficient reserve for potential sellbacks"
        );
        payable(owner).sendValue(amount);
    }

    function sellBack(uint256 amount) external notBlacklisted(msg.sender) {
        require(
            balanceOf(msg.sender) >= amount,
            "You do not have enough tokens to sell"
        );

        // 1. (_amount * 5 * 10**17) calculates the total wei as if each token was worth 0.5 ether
        // 2. Dividing by (10**21) adjusts for both:
        //    a) The fact that we want 0.5 (5 * 10**-1) ether per 1000 tokens
        //    b) The 18 decimal places of ERC20 tokens (so divide by 10**18)
        //    Combined, this is a division by 10**3 * 10**18 = 10**21
        uint256 etherAmount = (amount * 5 * 10 ** 17) / (10 ** 21);
        require(
            address(this).balance >= etherAmount,
            "The contract does not have enough ether to pay you"
        );

        bool isTransferSuccessful = transferFrom(
            msg.sender,
            address(this),
            amount
        );
        require(isTransferSuccessful, "Transfer to contract failed");

        payable(msg.sender).sendValue(etherAmount);
        emit TokensSold(msg.sender, amount, etherAmount);
    }
}
