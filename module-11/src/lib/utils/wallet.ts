import pkg from 'elliptic';
import type { RpcRequest } from '$lib/types/rpc-request';
import type { Network } from '$lib/stores/networks';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { hexToBytes, bytesToHex } from 'ethereum-cryptography/utils';
import { RLP } from '@ethereumjs/rlp';
import type {
	PreparedTransaction,
	RawTransaction,
	SignedTransaction
} from '$lib/types/transaction';

const { ec } = pkg;

function generateKeysPair(): { privateKey: string; publicAddress: string } {
	const ecdsa = new ec('secp256k1');
	const keys = ecdsa.genKeyPair();
	const privateKey = keys.getPrivate('hex');
	const publicKey = keys.getPublic(false, 'hex').slice(2); // Get uncompressed public key and remove '04' prefix
	const address = keccak256(hexToBytes(publicKey)).slice(-20);
	const publicAddress = '0x' + bytesToHex(address);
	return { privateKey, publicAddress };
}

async function getBalance(address: string, network: Network): Promise<bigint> {
	try {
		const request: RpcRequest = {
			method: 'eth_getBalance',
			params: [address, 'latest'],
			baseURL: network.url
		};
		const response = await fetch('/api/rpc', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(request)
		});

		if (!response.ok) throw new Error('Failed to fetch balance');
		const balanceInWei = await response.json();
		return BigInt(balanceInWei);
	} catch (error) {
		console.error(`Failed to get balance for address ${address}: ${error}`);
		throw new Error('Failed to get balance');
	}
}

async function estimateGas(tx: any, network: Network): Promise<bigint> {
	const estimationTx = {
		from: tx.from,
		to: tx.to,
		value: tx.value,
		data: tx.data || '0x'
	};

	const request: RpcRequest = {
		method: 'eth_estimateGas',
		params: [estimationTx],
		baseURL: network.url
	};

	try {
		const response = await fetch('/api/rpc', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(request)
		});

		const data = await response.json();

		if (!response.ok || data.error) {
			const errorMessage = data.error?.message || 'Gas estimation failed';
			throw new Error(errorMessage);
		}

		return BigInt(data);
	} catch (error) {
		console.error('Gas estimation error:', error);
		return BigInt(21000);
	}
}

async function getNonce(address: string, network: Network): Promise<number> {
	const request: RpcRequest = {
		method: 'eth_getTransactionCount',
		params: [address, 'latest'],
		baseURL: network.url
	};

	const response = await fetch('/api/rpc', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(request)
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(`Failed to get nonce: ${error.error?.message || 'Unknown error'}`);
	}
	const result = await response.json();
	return parseInt(result, 16);
}

async function getGasPrice(network: Network): Promise<bigint> {
	const request: RpcRequest = {
		method: 'eth_gasPrice',
		params: [],
		baseURL: network.url
	};

	const response = await fetch('/api/rpc', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(request)
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(`Failed to get gas price: ${error.error?.message || 'Unknown error'}`);
	}
	const result = await response.json();
	return BigInt(result);
}

function prepareTransaction(transaction: RawTransaction): PreparedTransaction {
	const txData = [
		transaction.nonce,
		transaction.gasPrice,
		transaction.gasLimit,
		hexToBytes(transaction.to.toLowerCase()),
		transaction.value,
		hexToBytes(transaction.data.replace('0x', '')),
		transaction.chainId,
		0, // v
		0 // s
	];

	// RLP encode the transaction
	const encodedTx = RLP.encode(txData);

	// Hash the encoded transaction
	const messageHash = keccak256(encodedTx);

	return {
		messageHash,
		encodedTx,
		txData
	};
}

const signTransaction = async (
	preparedTx: PreparedTransaction,
	privateKey: string,
	chainId: number
): Promise<SignedTransaction> => {
	try {
		// Remove '0x' prefix if present
		const cleanPrivateKey = privateKey.replace('0x', '');
		const privateKeyBytes = hexToBytes(cleanPrivateKey);

		// Sign the hash
		const signature = secp256k1.sign(preparedTx.messageHash, privateKeyBytes);

		// Calculate v value - EIP-155
		const v = signature.recovery + 35 + chainId * 2;

		console.log('Signature details:', {
			chainId,
			recovery: signature.recovery,
			calculatedV: v
		});

		// Prepare the signed transaction
		const signedTxData = [
			...preparedTx.txData.slice(0, 6), // Take the transaction data without chainId and empty v,r,s
			v,
			signature.r,
			signature.s
		];

		// RLP encode the signed transaction
		const signedTx = RLP.encode(signedTxData);

		return {
			v,
			r: signature.r,
			s: signature.s,
			serialized: '0x' + bytesToHex(signedTx)
		};
	} catch (error) {
		throw new Error(`Error signing transaction: ${error}`);
	}
};

export {
	generateKeysPair,
	getBalance,
	estimateGas,
	getNonce,
	getGasPrice,
	prepareTransaction,
	signTransaction
};
