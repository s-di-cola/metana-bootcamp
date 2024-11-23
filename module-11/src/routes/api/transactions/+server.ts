import { SECRET_ETHERSCAN_API_KEY } from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';

const ETHERSCAN_URLS = {
    'mainnet': 'https://api.etherscan.io/api',
    'sepolia': 'https://api-sepolia.etherscan.io/api',
    'holesky': 'https://api-holesky.etherscan.io/api'
};

export const GET: RequestHandler = async ({ url }) => {
    const address = url.searchParams.get('address');
    const network = url.searchParams.get('network') || 'mainnet';

    if (!address) {
        return new Response(JSON.stringify({ error: 'Address is required' }), { status: 400 });
    }

    const baseUrl = ETHERSCAN_URLS[network as keyof typeof ETHERSCAN_URLS] || ETHERSCAN_URLS.mainnet;
    const apiUrl = `${baseUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${SECRET_ETHERSCAN_API_KEY}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return new Response(JSON.stringify(data));
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch transactions' }), { status: 500 });
    }
};
