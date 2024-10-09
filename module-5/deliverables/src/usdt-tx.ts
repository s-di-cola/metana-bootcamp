import { Alchemy, Log, Network } from "alchemy-sdk";
import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";
import "dotenv/config";

const TRANSFER_TOPIC = keccak256(
  toUtf8Bytes("Transfer(address,address,uint256)"),
);
const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY;
const USDT_CONTRACT = "0xdac17f958d2ee523a2206206994597c13d831ec7";

const settings = {
  apiKey: ALCHEMY_KEY,
  network: Network.ETH_MAINNET,
};

interface BlockTransaction {
  block: number;
  transactions: number;
  totalValue: number;
  baseFee: number;
  gasUsed: number;
  gasLimit: number;
  gasUsedOverLimit: number;
}

const alchemy = new Alchemy(settings);

async function getTotalVolumeOfTransfers(
  blockNumber: number,
): Promise<BlockTransaction> {
  const block = await alchemy.core.getBlockWithTransactions(blockNumber);
  const transactions = await alchemy.core.getLogs({
    fromBlock: block.number,
    toBlock: block.number,
    address: USDT_CONTRACT,
    topics: [TRANSFER_TOPIC],
  });
  return {
    block: block.number,
    transactions: transactions.length,
    totalValue: transactions.reduce(
      (acc, curr) => acc + parseInt(curr.data),
      0,
    ),
    baseFee: block.baseFeePerGas!.toNumber(),
    gasUsed: block.gasUsed.toNumber(),
    gasLimit: block.gasLimit.toNumber(),
    gasUsedOverLimit:
      (block.gasUsed.toNumber() / block.gasLimit.toNumber()) * 100,
  };
}

async function fetchTotalTransferVolumeForRecentBlocks(
  amount: number,
): Promise<BlockTransaction[]> {
  const latestBlock = await alchemy.core.getBlockNumber();
  const data: BlockTransaction[] = [];
  for (let i = 0; i < amount; i++) {
    data.push(await getTotalVolumeOfTransfers(latestBlock - i));
  }
  return data.reverse();
}

function listenForNewTransactions(callback: (log: BlockTransaction) => void) {
  const processedBlocks = new Set<number>();
  alchemy.ws.on(
    {
      address: USDT_CONTRACT,
      topics: [TRANSFER_TOPIC],
    },
    async (log: Log) => {
      if (!processedBlocks.has(log.blockNumber)) {
        processedBlocks.add(log.blockNumber);
        callback(await getTotalVolumeOfTransfers(log.blockNumber));
      }
    },
  );
}

export { fetchTotalTransferVolumeForRecentBlocks, listenForNewTransactions };
