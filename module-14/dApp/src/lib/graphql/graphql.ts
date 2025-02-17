import { gql, request } from 'graphql-request';
import type { Order } from '$lib/types';
 const endpoint = "http://localhost:8000/subgraphs/name/limit-order-subgraph";

const document = gql`
    query GetOrders($userAddress: String!) {
        orders(where: { maker: $userAddress }) {
            id
            orderID
            maker
            tokenIn
            tokenOut
            amount
            targetPrice
            state
            timestamp
            transactionHash
            executedTransactionHash
            executedAt
            cancelledAt
            expiry
        }
    }
`;

export async function fetchOrders(userAddress: string): Promise<Order[]> {
    const response = await request(endpoint, document, { userAddress });
    return response.orders;
}
