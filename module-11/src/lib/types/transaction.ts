interface RawTransaction {
    nonce: number;
    gasPrice: bigint;
    gasLimit: bigint;
    to: string;
    value: bigint;
    data: string;
    chainId: number;
}

interface PreparedTransaction {
    messageHash: Uint8Array;
    encodedTx: Uint8Array;
    txData: (number | bigint | Uint8Array)[];
}

interface SignedTransaction {
    v: number;
    r: bigint;
    s: bigint;
    serialized: string;
}


export type {
    RawTransaction,
    PreparedTransaction,
    SignedTransaction
}
