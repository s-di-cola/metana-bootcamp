import { SECRET_ALCHEMY_API_KEY } from '$env/static/private';
import { json, type RequestEvent } from '@sveltejs/kit';
import type { RpcRequest } from "$lib/types/rpc-request";

export async function POST({ request }: RequestEvent) {
    try {
        const requestData: RpcRequest = await request.json();

        const payload = {
            jsonrpc: '2.0',
            method: requestData.method,
            params: requestData.params,
            id: 1
        };

        const response = await fetch(`${requestData.baseURL}/${SECRET_ALCHEMY_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('RPC error:', error);
            return json({ error }, { status: response.status });
        }

        const data = await response.json();

        if (data.error) {
            console.error('RPC error:', data.error);
            return json({ error: data.error.message || 'RPC request failed' }, { status: 400 });
        }

        return json(data.result);
    } catch (e) {
        console.error('Failed to make RPC request:', e);
        return json({ error: 'Failed to make RPC request' }, { status: 500 });
    }
}
