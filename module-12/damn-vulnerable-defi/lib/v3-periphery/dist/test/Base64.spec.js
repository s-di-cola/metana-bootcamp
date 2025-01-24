"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const base64_1 = require("./shared/base64");
const expect_1 = require("./shared/expect");
const crypto_1 = require("crypto");
const snapshotGasCost_1 = __importDefault(require("./shared/snapshotGasCost"));
function stringToHex(str) {
    return `0x${Buffer.from(str, 'utf8').toString('hex')}`;
}
describe('Base64', () => {
    let base64;
    before('deploy test contract', async () => {
        base64 = (await (await hardhat_1.ethers.getContractFactory('Base64Test')).deploy());
    });
    describe('#encode', () => {
        it('is correct for empty bytes', async () => {
            (0, expect_1.expect)(await base64.encode(stringToHex(''))).to.eq('');
        });
        for (const example of [
            'test string',
            'this is a test',
            'alphabet soup',
            'aLpHaBeT',
            'includes\nnewlines',
            '<some html>',
            '😀',
            'f',
            'fo',
            'foo',
            'foob',
            'fooba',
            'foobar',
            'this is a very long string that should cost a lot of gas to encode :)',
        ]) {
            it(`works for "${example}"`, async () => {
                (0, expect_1.expect)(await base64.encode(stringToHex(example))).to.eq((0, base64_1.base64Encode)(example));
            });
            it(`gas cost of encode(${example})`, async () => {
                await (0, snapshotGasCost_1.default)(base64.getGasCostOfEncode(stringToHex(example)));
            });
        }
        describe('max size string (24kB)', () => {
            let str;
            before(() => {
                str = Array(24 * 1024)
                    .fill(null)
                    .map((_, i) => String.fromCharCode(i % 1024))
                    .join('');
            });
            it('correctness', async () => {
                (0, expect_1.expect)(await base64.encode(stringToHex(str))).to.eq((0, base64_1.base64Encode)(str));
            });
            it('gas cost', async () => {
                await (0, snapshotGasCost_1.default)(base64.getGasCostOfEncode(stringToHex(str)));
            });
        });
        it('tiny fuzzing', async () => {
            const inputs = [];
            for (let i = 0; i < 100; i++) {
                inputs.push((0, crypto_1.randomBytes)(Math.random() * 100));
            }
            const promises = inputs.map((input) => {
                return base64.encode(`0x${input.toString('hex')}`);
            });
            const results = await Promise.all(promises);
            for (let i = 0; i < inputs.length; i++) {
                (0, expect_1.expect)(inputs[i].toString('base64')).to.eq(results[i]);
            }
        }).timeout(300000);
    });
});
