// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/PredictTheFuture.sol";

contract PredictTheFutureTest is Test {
    PredictTheFuture public predictTheFuture;
    ExploitContract public exploitContract;

    function setUp() public {
        // Deploy contracts
        predictTheFuture = (new PredictTheFuture){value: 1 ether}();
        exploitContract = new ExploitContract(predictTheFuture);
        vm.deal(address(exploitContract), 1 ether);
    }

    function testGuess() public {
        vm.warp(93582192);
        exploitContract.guess();
        vm.roll(258);
        for (uint8 i = 0; i < 10; i++) {
            if (predictTheFuture.isComplete()) {
                break;
            }
            exploitContract.attemptSettle();
            vm.roll(block.number + 1);
        }
        _checkSolved();
    }

    function _checkSolved() internal {
        assertTrue(predictTheFuture.isComplete(), "Challenge Incomplete");
    }

    receive() external payable {}
}
