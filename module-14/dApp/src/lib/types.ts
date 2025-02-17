import type {Address} from "viem";

export enum OrderType {
    BUY = 0,
    SELL = 1
}

export enum OrderState {
    PLACED = "PLACED",
    EXECUTED = "EXECUTED",
    CANCELLED = "CANCELLED"
}

export interface Order {
    id?: string;
    orderID?: string;
    fee: number;
    orderType: OrderType;
    state?: OrderState;
    executed?: boolean;
    maker?: string;
    tokenIn: string;
    tokenOut: string;
    amount: bigint;
    targetPrice: bigint;
    expiry: bigint;
    transactionHash?: string;
}



