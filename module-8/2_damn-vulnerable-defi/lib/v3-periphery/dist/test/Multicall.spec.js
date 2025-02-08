"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const expect_1 = require("./shared/expect");
const snapshotGasCost_1 = __importDefault(require("./shared/snapshotGasCost"));
describe('Multicall', async () => {
    let wallets;
    let multicall;
    before('get wallets', async () => {
        wallets = await hardhat_1.ethers.getSigners();
    });
    beforeEach('create multicall', async () => {
        const multicallTestFactory = await hardhat_1.ethers.getContractFactory('TestMulticall');
        multicall = (await multicallTestFactory.deploy());
    });
    it('revert messages are returned', async () => {
        await (0, expect_1.expect)(multicall.multicall([multicall.interface.encodeFunctionData('functionThatRevertsWithError', ['abcdef'])])).to.be.revertedWith('abcdef');
    });
    it('return data is properly encoded', async () => {
        const [data] = await multicall.callStatic.multicall([
            multicall.interface.encodeFunctionData('functionThatReturnsTuple', ['1', '2']),
        ]);
        const { tuple: { a, b }, } = multicall.interface.decodeFunctionResult('functionThatReturnsTuple', data);
        (0, expect_1.expect)(b).to.eq(1);
        (0, expect_1.expect)(a).to.eq(2);
    });
    describe('context is preserved', () => {
        it('msg.value', async () => {
            await multicall.multicall([multicall.interface.encodeFunctionData('pays')], { value: 3 });
            (0, expect_1.expect)(await multicall.paid()).to.eq(3);
        });
        it('msg.value used twice', async () => {
            await multicall.multicall([multicall.interface.encodeFunctionData('pays'), multicall.interface.encodeFunctionData('pays')], { value: 3 });
            (0, expect_1.expect)(await multicall.paid()).to.eq(6);
        });
        it('msg.sender', async () => {
            (0, expect_1.expect)(await multicall.returnSender()).to.eq(wallets[0].address);
        });
    });
    it('gas cost of pay w/o multicall', async () => {
        await (0, snapshotGasCost_1.default)(multicall.pays({ value: 3 }));
    });
    it('gas cost of pay w/ multicall', async () => {
        await (0, snapshotGasCost_1.default)(multicall.multicall([multicall.interface.encodeFunctionData('pays')], { value: 3 }));
    });
});
