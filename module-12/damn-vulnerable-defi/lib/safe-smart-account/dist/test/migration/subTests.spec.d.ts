import { Contract } from "ethers";
interface TestSetup {
    migratedSafe: Contract;
    mock: Contract;
    multiSend: Contract;
}
export declare const verificationTests: (setupTests: () => Promise<TestSetup>) => void;
export {};
