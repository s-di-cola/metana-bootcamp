import {buildModule} from "@nomicfoundation/hardhat-ignition/modules";
import {vars} from "hardhat/config";

const DAOModule = buildModule("SimpleDAO", (m) => {
    // Deploy the governance token
    const governanceToken = m.contract("GovernanceToken");


    // Parameters for the timelock
    const minDelay = 86400; // 1 day in seconds
    const proposers: string[] = [];  // Empty array, will be filled later
    const executors: string[] = [];  // Empty array, will be filled later
    const adminAddress = m.getParameter("adminAddr",vars.get("WALLET_PUBLIC_ADDR"));

    // Deploy timelock controller
    const timelock = m.contract("TimeLock", [
        minDelay,
        proposers,
        executors,
        adminAddress,
    ]);

    // Deploy the governor
    const governor = m.contract("DAO", [
        governanceToken,
        timelock,
    ]);

    // Deploy treasury with timelock as the owner
    const treasury = m.contract("Treasury", [timelock]);

    return {
        governanceToken,
        timelock,
        governor,
        treasury,
    };
});

export default DAOModule;
