import { json } from '@sveltejs/kit';
import { SECRET_ALCHEMY_API_KEY} from "$env/static/private";

export async function GET({ params }: { params: { symbol: string } }): Promise<Response> {
    const { symbol } = params;
    const url = `https://api.g.alchemy.com/prices/v1/tokens/by-symbol?symbols=${symbol}`;
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${SECRET_ALCHEMY_API_KEY}`
    };

    const response = await fetch(url, {
        method: 'GET',
        headers
    });

    if (!response.ok) {
        return json({ error: 'Failed to fetch price data' }, { status: response.status });
    }

    const data = await response.json();
    return json(data);
}
