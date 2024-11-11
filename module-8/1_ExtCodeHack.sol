// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

contract ExtCodeHack {
    event CodeSizeCheck(uint256 size, string context);

    constructor() {
        uint256 size;
        assembly {
            size := extcodesize(address())
        }
        require(size == 0, "Size must be 0 at construction time");
        emit CodeSizeCheck(size, "constructor");
    }

    function checkCurrentSize() external {
        uint256 size;
        assembly {
            size := extcodesize(address())
        }
        emit CodeSizeCheck(size, "after-deployment");
    }
}

contract SecureContract {
    event ContractCheck(address caller, bool isContract);

    constructor() {
        require(msg.sender.code.length == 0, "EOA only");
        emit ContractCheck(msg.sender, false);
    }

    function onlyEOA() external {
        require(msg.sender == tx.origin, "EOA only");
        emit ContractCheck(msg.sender, true);
    }
}

contract Bastion {
    constructor() {
        // This works because code.length is 0 during construction
        new SecureContract();
    }
}

contract Attacker {
    SecureContract public sc;

    constructor() {
        // This works! The chain of constructors all have code.length = 0
        new Bastion();
    }

    function tryToBypass() external {
        // This fails because now we're not in a constructor
        // and msg.sender != tx.origin
        sc.onlyEOA();
    }
}

contract TestHarness {
    event TestResult(string test, string result);

    function runAllTests() external {
        // Test 1: ExtCodeHack deployment and size check
        ExtCodeHack hack = new ExtCodeHack();
        hack.checkCurrentSize();
        emit TestResult("ExtCodeHack", "Demonstrates size difference");

        // Test 2: Constructor chain deployment (should work)
        try new Attacker() {
            emit TestResult("Constructor chain deployment", "Success - code.length check bypassed");
        } catch Error(string memory reason) {
            emit TestResult("Constructor chain deployment", reason);
        }

        // Test 3: Try to bypass tx.origin check (should fail)
        Attacker attacker = new Attacker();
        try attacker.tryToBypass() {
            emit TestResult("tryToBypass call", "Success - unexpected!");
        } catch Error(string memory reason) {
            emit TestResult("tryToBypass call", reason);
        }
    }
}
