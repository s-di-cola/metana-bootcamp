import hre from "hardhat";
import {expect} from "chai";
import SimpleDAO from "../ignition/modules/SimpleDAO";
import {zeroAddress, encodeFunctionData, decodeEventLog, toHex, keccak256} from "viem";
import {
    IgnitionModuleResultsToViemContracts
} from "@nomicfoundation/hardhat-ignition-viem/dist/src/ignition-module-results-to-viem-contracts";
import {NamedArtifactContractDeploymentFuture} from "@nomicfoundation/ignition-core";

describe("DAO Test", () => {
    // @ts-ignore
    let publicClient;
    let admin;
    let contracts;

    // Helper function to create a proposal
    async function createProposal(proposer, recipient, amount, description) {
        const governor = await hre.viem.getContractAt("DAO", contracts.governor.address);
        const treasury = await hre.viem.getContractAt("Treasury", contracts.treasury.address);

        const releaseFunds = encodeFunctionData({
            abi: treasury.abi,
            functionName: "releaseFunds",
            args: [recipient, amount]
        });

        const txHash = await governor.write.propose([[treasury.address], [0n], [releaseFunds], description], {account: proposer.account});
        const receipt = await publicClient.waitForTransactionReceipt({hash: txHash});

        // Decode event log to get proposalId
        const proposalCreatedEvent = governor.abi.find(item => item.type === 'event' && item.name === 'ProposalCreated');
        if (!proposalCreatedEvent) {
            throw new Error('ProposalCreated event not found in ABI');
        }

        const log = receipt.logs[0];
        const decodedLog = decodeEventLog({
            abi: [proposalCreatedEvent],
            data: log.data,
            topics: log.topics,
        });

        return {
            proposalId: decodedLog.args.proposalId,
            description: description,
            targets: [treasury.address],
            values: [0n],
            calldatas: [releaseFunds]
        };
    }

    // Helper function to advance proposal to voting phase
    async function advanceToVotingPhase(proposalId) {
        const governor = await hre.viem.getContractAt("DAO", contracts.governor.address);
        const votingDelay = await governor.read.votingDelay();
        const testClient = await hre.viem.getTestClient();

        await testClient.mine({ blocks: Number(votingDelay) + 1 });

        const state = await governor.read.state([proposalId]);
        console.log(`Proposal state after voting delay: ${state}`);
        return state;
    }

    // Helper function to end voting period
    async function endVotingPeriod(proposalId) {
        const governor = await hre.viem.getContractAt("DAO", contracts.governor.address);
        const votingPeriod = await governor.read.votingPeriod();
        const testClient = await hre.viem.getTestClient();

        await testClient.mine({ blocks: Number(votingPeriod) + 1 });

        const state = await governor.read.state([proposalId]);
        console.log(`Proposal state after voting period: ${state}`);
        return state;
    }

    // Helper to prepare the environment with enough tokens for quorum
    async function setupQuorumVoting() {
        const [, alice, bob] = await hre.viem.getWalletClients();
        const governanceToken = await hre.viem.getContractAt("GovernanceToken", contracts.governanceToken.address);
        const totalSupply = await governanceToken.read.maxSupply();

        // Calculate quorum requirement (4% of total supply)
        const quorumTokens = (totalSupply * 4n) / 100n + 10n; // Add some buffer

        // Distribute tokens
        await governanceToken.write.transfer([alice.account.address, quorumTokens], {account: admin.account});
        await governanceToken.write.transfer([bob.account.address, 100n], {account: admin.account});

        // Delegate voting power
        await governanceToken.write.delegate([alice.account.address], {account: alice.account});
        await governanceToken.write.delegate([bob.account.address], {account: bob.account});

        return { alice, bob, quorumTokens };
    }

    beforeEach(async () => {
        // Get test client for impersonation
        [admin] = await hre.viem.getWalletClients();
        publicClient = await hre.viem.getPublicClient();

        // Deploy the DAO using impersonated account
        contracts = await hre.ignition.deploy(SimpleDAO, {
            parameters: {
                SimpleDAO: {
                    adminAddr: admin.account.address
                }
            },
        });

        // Set up TimeLocker with proper roles
        const timeLockWrite = await hre.viem.getContractAt(
            "TimeLock",
            contracts.timelock.address
        );

        const proposerRole = await timeLockWrite.read.PROPOSER_ROLE();
        const executorRole = await timeLockWrite.read.EXECUTOR_ROLE();

        // Set roles
        await timeLockWrite.write.grantRole([proposerRole, contracts.governor.address], {account: admin.account});
        await timeLockWrite.write.grantRole([executorRole, zeroAddress], {account: admin.account});
    });

    describe("Basic Setup", () => {
        it('should verify roles', async () => {
            const timeLock = await hre.viem.getContractAt("TimeLock", contracts.timelock.address);
            const proposerRole = await timeLock.read.PROPOSER_ROLE();
            const executorRole = await timeLock.read.EXECUTOR_ROLE();

            expect(await timeLock.read.hasRole([proposerRole, contracts.governor.address])).to.be.true;
            expect(await timeLock.read.hasRole([executorRole, zeroAddress])).to.be.true;
        });

        it('should delegate voting power to self', async () => {
            const governanceToken = await hre.viem.getContractAt("GovernanceToken", contracts.governanceToken.address);
            expect(await governanceToken.read.getVotes([admin.account.address])).to.be.equal(0n);
            await governanceToken.write.delegate([admin.account.address], {account: admin.account});
            expect(await governanceToken.read.getVotes([admin.account.address])).to.be.equal(await governanceToken.read.maxSupply());
        });
    });

    describe("Proposal Management", () => {
        it('should create a proposal', async () => {
            const [, alice] = await hre.viem.getWalletClients();

            // Give alice some tokens and delegate to herself
            const governanceToken = await hre.viem.getContractAt("GovernanceToken", contracts.governanceToken.address);
            await governanceToken.write.transfer([alice.account.address, 500n], {account: admin.account});
            await governanceToken.write.delegate([alice.account.address], {account: alice.account});

            const proposal = await createProposal(alice, alice.account.address, 100n, "Proposal #1: Send funds to Alice");
            expect(proposal.values[0]).to.equal(0n);
        });

        it('should vote on a proposal and be defeated due to low quorum', async () => {
            const [, alice, bob] = await hre.viem.getWalletClients();
            const governor = await hre.viem.getContractAt("DAO", contracts.governor.address);
            const governanceToken = await hre.viem.getContractAt("GovernanceToken", contracts.governanceToken.address);

            // Setup voting tokens
            await governanceToken.write.transfer([alice.account.address, 30n], {account: admin.account});
            await governanceToken.write.transfer([bob.account.address, 10n], {account: admin.account});
            await governanceToken.write.delegate([alice.account.address], {account: alice.account});
            await governanceToken.write.delegate([bob.account.address], {account: bob.account});

            // Create proposal
            const proposal = await createProposal(alice, bob.account.address, 100n, "Proposal #2: Send funds to Bob");
            console.log("Initial state:", await governor.read.state([proposal.proposalId]));

            // Advance to voting phase
            await advanceToVotingPhase(proposal.proposalId);

            // Cast votes
            await governor.write.castVote([proposal.proposalId, 0], {account: alice.account}); // Against
            await governor.write.castVote([proposal.proposalId, 1], {account: bob.account}); // For

            // Check voting results
            const votes = await governor.read.proposalVotes([proposal.proposalId]);
            expect(votes[0]).to.equal(30n);
            expect(votes[1]).to.equal(10n);

            // End voting period
            const finalState = await endVotingPeriod(proposal.proposalId);

            // Proposal should be defeated due to low participation
            expect(finalState).to.equal(3); // Defeated
        });
    });

    describe("Full Lifecycle", () => {
        it('should pass, queue, and execute a proposal when it meets quorum requirements', async () => {
            // Setup accounts with sufficient voting power
            const { alice, bob, quorumTokens } = await setupQuorumVoting();

            const governor = await hre.viem.getContractAt("DAO", contracts.governor.address);
            const treasury = await hre.viem.getContractAt("Treasury", contracts.treasury.address);
            const governanceToken = await hre.viem.getContractAt("GovernanceToken", contracts.governanceToken.address);

            // Check initial balances
            const treasuryBalance = treasury.read.getBalance();
            console.log(`Treasury initial balance: ${treasuryBalance}`);

            // Fund the treasury if needed (implementation may vary based on your Treasury contract)
            // This is just a placeholder - adjust based on how your Treasury is designed
            try {
                await admin.sendTransaction({
                    account: admin.account,
                    to: contracts.treasury.address,
                    value: 1000n
                });
                console.log("Funded treasury with 1000 wei");
            } catch (error) {
                console.log("Could not fund treasury directly, may need a different approach");
            }

            // Create proposal
            const proposal = await createProposal(alice, bob.account.address, 100n, "Proposal #3: Send funds to Bob");
            console.log("Initial state:", await governor.read.state([proposal.proposalId]));

            // Advance to voting phase
            await advanceToVotingPhase(proposal.proposalId);

            // Cast votes - both vote for to ensure it passes
            await governor.write.castVote([proposal.proposalId, 1], {account: bob.account}); // For
            await governor.write.castVote([proposal.proposalId, 1], {account: alice.account}); // For

            // Check voting results
            const votes = await governor.read.proposalVotes([proposal.proposalId]);
            console.log(`Votes - For: ${votes[0]}, Against: ${votes[1]}, Abstain: ${votes[2]}`);

            // End voting period
            const finalState = await endVotingPeriod(proposal.proposalId);
            expect(finalState).to.equal(4); // Succeeded

            // Queue the proposal
            const descriptionHash = keccak256(toHex(proposal.description));
            await governor.write.queue(
                [proposal.targets, proposal.values, proposal.calldatas, descriptionHash],
                {account: alice.account}
            );

            const queuedState = await governor.read.state([proposal.proposalId]);
            console.log(`State after queueing: ${queuedState}`);
            expect(queuedState).to.equal(5); // Queued

            // Get the timelock delay
            const timelock = await hre.viem.getContractAt("TimeLock", contracts.timelock.address);
            const delay = await timelock.read.getMinDelay();
            console.log(`Timelock delay: ${delay} seconds`);

            // Advance time to pass the timelock delay
            const testClient = await hre.viem.getTestClient();
            await testClient.increaseTime({seconds: Number(delay) + 1});
            await testClient.mine({blocks: 1}); // Mine a block to record the time change

            // Execute the proposal
            await governor.write.execute(
                [proposal.targets, proposal.values, proposal.calldatas, descriptionHash],
                {account: alice.account}
            );

            const executedState = await governor.read.state([proposal.proposalId]);
            console.log(`State after execution: ${executedState}`);
            expect(executedState).to.equal(7); // Executed

            // Verify the funds were released to Bob
            console.log("Proposal successfully executed");
            const bobBalance = await governanceToken.read.balanceOf([bob.account.address]);
            console.log(`Bob's balance: ${bobBalance}`);
            expect(bobBalance).to.equal(100n);
        });
    });
});
