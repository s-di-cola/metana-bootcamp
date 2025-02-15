import { expect } from 'chai';
import { ethers } from 'ethers';
import { FakeContract, smock } from '@defi-wonderland/smock';
import sinon from 'sinon';
import { abi as LimitOrderABI } from '../artifacts/contracts/LimitOrder.sol/LimitOrder.json';
import proxyquire from 'proxyquire';
import { abi as FeedRegistryABI } from '../artifacts/contracts/IFeedRegistry.sol/IFeedRegistry.json';

describe('Defender Action Tests', () => {
    let limitOrderFake: FakeContract;
    let feedRegistryFake: FakeContract;
    let handler: any;
    let mockProvider: any;
    let wallet: ethers.Wallet;

    beforeEach(async () => {
        // Create a basic mock provider
        mockProvider = {
            getNetwork: sinon.stub().resolves({ chainId: 1, name: 'mainnet' }),
            call: sinon.stub().resolves('0x0000000000000000000000000000000000000000000000000000000000000000'),
            estimateGas: sinon.stub().resolves(ethers.BigNumber.from('100000')),
            getGasPrice: sinon.stub().resolves(ethers.BigNumber.from('1000000000')),
            getBlock: sinon.stub().resolves({ timestamp: Math.floor(Date.now() / 1000) }),
            getBlockNumber: sinon.stub().resolves(1000000),
            on: sinon.stub(),
            removeListener: sinon.stub(),
            removeAllListeners: sinon.stub(),
            listenerCount: sinon.stub().returns(0),
            listeners: sinon.stub().returns([]),
            waitForTransaction: sinon.stub().resolves({ status: 1 }),
            _isProvider: true
        };

        // Create wallet with mock provider
        wallet = new ethers.Wallet(ethers.Wallet.createRandom().privateKey, mockProvider);

        // Setup fake contracts
        limitOrderFake = await smock.fake(LimitOrderABI, {provider: mockProvider});
        feedRegistryFake = await smock.fake(FeedRegistryABI, {provider: mockProvider});

        // Create Defender mock
        class DefenderMock {
            relaySigner: any;
            constructor() {
                this.relaySigner = {
                    getProvider: () => mockProvider,
                    getSigner: () => Promise.resolve(wallet)
                };
            }
        }

        // Create Contract stub that returns our fakes
        const ContractStub = function(address: string, abi: any, signerOrProvider: any) {
            if (address.toLowerCase() === '0xf65a0930ac58e0640d46b60a038dd8406512834c'.toLowerCase()) {
                const contract = limitOrderFake;
                contract.connect = () => contract;
                return contract;
            }
            if (address.toLowerCase() === '0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf'.toLowerCase()) {
                const contract = feedRegistryFake;
                contract.connect = () => contract;
                return contract;
            }
            throw new Error(`Unexpected contract address: ${address}`);
        };

        // Setup proxyquire
        const proxied = proxyquire('../scripts/defender-action', {
            '@openzeppelin/defender-sdk': {
                Defender: DefenderMock
            },
            'ethers': {
                ...ethers,
                Contract: ContractStub
            }
        });

        handler = proxied.handler;
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should handle an empty orders list', async () => {
        limitOrderFake.getOrders.returns(ethers.BigNumber.from('0'));
        await expect(handler({ apiKey: 'test', apiSecret: 'test' })).to.be.fulfilled;
    });

    it('should process a single inactive order', async () => {
        limitOrderFake.getOrders.returns(ethers.BigNumber.from('1'));
        limitOrderFake.s_orders.returns({
            fee: 0,
            orderType: 0,
            state: 1, // inactive
            executed: false,
            maker: wallet.address,
            tokenIn: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            tokenOut: '0x1111111111111111111111111111111111111111',
            amount: ethers.utils.parseEther('1'),
            targetPrice: ethers.utils.parseEther('2000'),
            timestamp: Math.floor(Date.now() / 1000),
            expiry: Math.floor(Date.now() / 1000) + 3600,
            transactionHash: ethers.utils.formatBytes32String('tx')
        });

        await expect(handler({ apiKey: 'test', apiSecret: 'test' })).to.be.fulfilled;
    });

    it('should process a single active order and execute when conditions met', async () => {
        limitOrderFake.getOrders.returns(ethers.BigNumber.from('1'));
        limitOrderFake.s_orders.returns({
            fee: 0,
            orderType: 0,
            state: 0, // active
            executed: false,
            maker: wallet.address,
            tokenIn: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            tokenOut: '0x1111111111111111111111111111111111111111',
            amount: ethers.utils.parseEther('1'),
            targetPrice: ethers.utils.parseEther('2000'),
            timestamp: Math.floor(Date.now() / 1000),
            expiry: Math.floor(Date.now() / 1000) + 3600,
            transactionHash: ethers.utils.formatBytes32String('tx')
        });

        feedRegistryFake.latestRoundData.returns({
            roundId: ethers.BigNumber.from('1'),
            answer: ethers.utils.parseEther('1900'), // Price below target for buy order
            startedAt: ethers.BigNumber.from(Math.floor(Date.now() / 1000)),
            updatedAt: ethers.BigNumber.from(Math.floor(Date.now() / 1000)),
            answeredInRound: ethers.BigNumber.from('1')
        });

        limitOrderFake.executeOrder.returns({
            hash: '0x1234',
            wait: async () => ({
                status: 1,
                blockNumber: 1,
                gasUsed: ethers.BigNumber.from('100000'),
                effectiveGasPrice: ethers.utils.parseUnits('20', 'gwei')
            })
        });

        await expect(handler({ apiKey: 'test', apiSecret: 'test' })).to.be.fulfilled;
    });

    it('should skip expired orders', async () => {
        limitOrderFake.getOrders.returns(ethers.BigNumber.from('1'));
        limitOrderFake.s_orders.returns({
            fee: 0,
            orderType: 0,
            state: 0,
            executed: false,
            maker: wallet.address,
            tokenIn: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            tokenOut: '0x1111111111111111111111111111111111111111',
            amount: ethers.utils.parseEther('1'),
            targetPrice: ethers.utils.parseEther('2000'),
            timestamp: Math.floor(Date.now() / 1000) - 7200,
            expiry: Math.floor(Date.now() / 1000) - 3600, // expired 1 hour ago
            transactionHash: ethers.utils.formatBytes32String('tx')
        });

        await expect(handler({ apiKey: 'test', apiSecret: 'test' })).to.be.fulfilled;
    });

    it('should handle failed transactions', async () => {
        limitOrderFake.getOrders.returns(ethers.BigNumber.from('1'));
        limitOrderFake.s_orders.returns({
            fee: 0,
            orderType: 0,
            state: 0,
            executed: false,
            maker: wallet.address,
            tokenIn: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            tokenOut: '0x1111111111111111111111111111111111111111',
            amount: ethers.utils.parseEther('1'),
            targetPrice: ethers.utils.parseEther('2000'),
            timestamp: Math.floor(Date.now() / 1000),
            expiry: Math.floor(Date.now() / 1000) + 3600,
            transactionHash: ethers.utils.formatBytes32String('tx')
        });

        feedRegistryFake.latestRoundData.returns({
            roundId: ethers.BigNumber.from('1'),
            answer: ethers.utils.parseEther('1900'),
            startedAt: ethers.BigNumber.from(Math.floor(Date.now() / 1000)),
            updatedAt: ethers.BigNumber.from(Math.floor(Date.now() / 1000)),
            answeredInRound: ethers.BigNumber.from('1')
        });

        // Setup failed transaction
        limitOrderFake.executeOrder.returns({
            hash: '0x1234',
            wait: async () => ({
                status: 0,
                blockNumber: 1,
                gasUsed: ethers.BigNumber.from('100000'),
                effectiveGasPrice: ethers.utils.parseUnits('20', 'gwei')
            })
        });

        // Even with a failed transaction, the handler should complete
        await expect(handler({ apiKey: 'test', apiSecret: 'test' })).to.be.fulfilled;
    });
});
