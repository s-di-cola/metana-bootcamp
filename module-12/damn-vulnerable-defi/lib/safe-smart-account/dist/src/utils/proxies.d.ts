export declare const calculateProxyAddress: (factory: Contract, singleton: string, inititalizer: string, nonce: number | string) => Promise<any>;
export declare const calculateProxyAddressWithCallback: (factory: Contract, singleton: string, inititalizer: string, nonce: number | string, callback: string) => Promise<any>;
export declare const calculateChainSpecificProxyAddress: (factory: Contract, singleton: string, inititalizer: string, nonce: number | string, chainId: BigNumberish) => Promise<any>;
