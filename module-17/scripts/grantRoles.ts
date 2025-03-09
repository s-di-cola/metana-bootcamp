import contractAddresses from '../ignition/deployments/chain-31337/deployed_addresses.json';
import {Address, getContract, http, createWalletClient} from 'viem';
import TimeLockArtifact from '../artifacts/contracts/TimeLock.sol/TimeLock.json';
import hre from "hardhat";
import {vars} from "hardhat/config";
import * as fs from "node:fs";
import {privateKeyToAccount} from 'viem/accounts';


interface TimeLockRoles {
    proposerRole: string;
    executorRole: string;
}

async function getTimeLockRoles(client: any, contract: Address, abi: any): Promise<TimeLockRoles> {
    const timeLock = getContract({abi, address: contract, client});
    // @ts-ignore
    const proposerRole: string = await timeLock.read.PROPOSER_ROLE();
    // @ts-ignore
    const executorRole: string = await timeLock.read.EXECUTOR_ROLE();
    return {proposerRole, executorRole};
}

function getContractAddresses(chainID: number): Record<string, Address> {
    const data = fs.readFileSync(`./ignition/deployments/chain-${chainID}/deployed_addresses.json`);
    return JSON.parse(data.toString());
}


function getWalletClient(walletPK: Address, chain: any) {
    const account = privateKeyToAccount(walletPK);
    return createWalletClient({account, chain, transport: http()});
}

async function grantGovernorRoles(timeLockContract?: Address): Promise<void> {
    const publicClient = await hre.viem.getPublicClient({transport: http()});
    const admin = getWalletClient('0x'+vars.get("WALLET_PRIVATE_KEY") as Address, publicClient.chain);
    const timeLockAddress = timeLockContract ?? getContractAddresses(publicClient.chain.id)["SimpleDAO#TimeLock"];
    const {
        proposerRole,
        executorRole
    } = await getTimeLockRoles(publicClient, timeLockAddress as Address, TimeLockArtifact.abi);

    const timeLock = getContract({
        abi: TimeLockArtifact.abi,
        address: timeLockAddress,
        client: {wallet: admin}
    });
    const proposerRoleTx = await timeLock.write.grantRole([proposerRole, contractAddresses["SimpleDAO#GovernanceToken"]]);
    await publicClient.waitForTransactionReceipt({hash: proposerRoleTx});

    const executorRoleTx = await timeLock.write.grantRole([executorRole, "0x0000000000000000000000000000000000000000"]);
    await publicClient.waitForTransactionReceipt({hash: executorRoleTx});

    console.log("Roles granted successfully!");
}

export {
    getTimeLockRoles,
    getWalletClient,
};
