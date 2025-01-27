type StateVariable = {
    name: string;
    slot: string;
    offset: number;
    type: string;
};
export declare const getContractStorageLayout: (hre: HardhatRuntimeEnvironment, smartContractName: string) => Promise<StateVariable[]>;
export {};
