// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Treasury is Ownable {
    // Event to log transfers
    event FundsReceived(address indexed from, uint256 amount);
    event FundsReleased(address indexed to, uint256 amount);

    constructor(address initialOwner) Ownable(initialOwner) {}

    // Function to receive ETH
    receive() external payable {
        emit FundsReceived(msg.sender, msg.value);
    }

    // Function to release funds, can only be called by the owner (which will be the timelock)
    function releaseFunds(address payable to, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        to.transfer(amount);
        emit FundsReleased(to, amount);
    }

    // Get contract balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
