"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const expect_1 = require("./shared/expect");
const snapshotGasCost_1 = __importDefault(require("./shared/snapshotGasCost"));
describe('TickBitmap', () => {
    let tickBitmap;
    beforeEach('deploy TickBitmapTest', async () => {
        const tickBitmapTestFactory = await hardhat_1.ethers.getContractFactory('TickBitmapTest');
        tickBitmap = (await tickBitmapTestFactory.deploy());
    });
    async function initTicks(ticks) {
        for (const tick of ticks) {
            await tickBitmap.flipTick(tick);
        }
    }
    describe('#isInitialized', () => {
        it('is false at first', async () => {
            (0, expect_1.expect)(await tickBitmap.isInitialized(1)).to.eq(false);
        });
        it('is flipped by #flipTick', async () => {
            await tickBitmap.flipTick(1);
            (0, expect_1.expect)(await tickBitmap.isInitialized(1)).to.eq(true);
        });
        it('is flipped back by #flipTick', async () => {
            await tickBitmap.flipTick(1);
            await tickBitmap.flipTick(1);
            (0, expect_1.expect)(await tickBitmap.isInitialized(1)).to.eq(false);
        });
        it('is not changed by another flip to a different tick', async () => {
            await tickBitmap.flipTick(2);
            (0, expect_1.expect)(await tickBitmap.isInitialized(1)).to.eq(false);
        });
        it('is not changed by another flip to a different tick on another word', async () => {
            await tickBitmap.flipTick(1 + 256);
            (0, expect_1.expect)(await tickBitmap.isInitialized(257)).to.eq(true);
            (0, expect_1.expect)(await tickBitmap.isInitialized(1)).to.eq(false);
        });
    });
    describe('#flipTick', () => {
        it('flips only the specified tick', async () => {
            await tickBitmap.flipTick(-230);
            (0, expect_1.expect)(await tickBitmap.isInitialized(-230)).to.eq(true);
            (0, expect_1.expect)(await tickBitmap.isInitialized(-231)).to.eq(false);
            (0, expect_1.expect)(await tickBitmap.isInitialized(-229)).to.eq(false);
            (0, expect_1.expect)(await tickBitmap.isInitialized(-230 + 256)).to.eq(false);
            (0, expect_1.expect)(await tickBitmap.isInitialized(-230 - 256)).to.eq(false);
            await tickBitmap.flipTick(-230);
            (0, expect_1.expect)(await tickBitmap.isInitialized(-230)).to.eq(false);
            (0, expect_1.expect)(await tickBitmap.isInitialized(-231)).to.eq(false);
            (0, expect_1.expect)(await tickBitmap.isInitialized(-229)).to.eq(false);
            (0, expect_1.expect)(await tickBitmap.isInitialized(-230 + 256)).to.eq(false);
            (0, expect_1.expect)(await tickBitmap.isInitialized(-230 - 256)).to.eq(false);
        });
        it('reverts only itself', async () => {
            await tickBitmap.flipTick(-230);
            await tickBitmap.flipTick(-259);
            await tickBitmap.flipTick(-229);
            await tickBitmap.flipTick(500);
            await tickBitmap.flipTick(-259);
            await tickBitmap.flipTick(-229);
            await tickBitmap.flipTick(-259);
            (0, expect_1.expect)(await tickBitmap.isInitialized(-259)).to.eq(true);
            (0, expect_1.expect)(await tickBitmap.isInitialized(-229)).to.eq(false);
        });
        it('gas cost of flipping first tick in word to initialized', async () => {
            await (0, snapshotGasCost_1.default)(await tickBitmap.getGasCostOfFlipTick(1));
        });
        it('gas cost of flipping second tick in word to initialized', async () => {
            await tickBitmap.flipTick(0);
            await (0, snapshotGasCost_1.default)(await tickBitmap.getGasCostOfFlipTick(1));
        });
        it('gas cost of flipping a tick that results in deleting a word', async () => {
            await tickBitmap.flipTick(0);
            await (0, snapshotGasCost_1.default)(await tickBitmap.getGasCostOfFlipTick(0));
        });
    });
    describe('#nextInitializedTickWithinOneWord', () => {
        beforeEach('set up some ticks', async () => {
            // word boundaries are at multiples of 256
            await initTicks([-200, -55, -4, 70, 78, 84, 139, 240, 535]);
        });
        describe('lte = false', async () => {
            it('returns tick to right if at initialized tick', async () => {
                const { next, initialized } = await tickBitmap.nextInitializedTickWithinOneWord(78, false);
                (0, expect_1.expect)(next).to.eq(84);
                (0, expect_1.expect)(initialized).to.eq(true);
            });
            it('returns tick to right if at initialized tick', async () => {
                const { next, initialized } = await tickBitmap.nextInitializedTickWithinOneWord(-55, false);
                (0, expect_1.expect)(next).to.eq(-4);
                (0, expect_1.expect)(initialized).to.eq(true);
            });
            it('returns the tick directly to the right', async () => {
                const { next, initialized } = await tickBitmap.nextInitializedTickWithinOneWord(77, false);
                (0, expect_1.expect)(next).to.eq(78);
                (0, expect_1.expect)(initialized).to.eq(true);
            });
            it('returns the tick directly to the right', async () => {
                const { next, initialized } = await tickBitmap.nextInitializedTickWithinOneWord(-56, false);
                (0, expect_1.expect)(next).to.eq(-55);
                (0, expect_1.expect)(initialized).to.eq(true);
            });
            it('returns the next words initialized tick if on the right boundary', async () => {
                const { next, initialized } = await tickBitmap.nextInitializedTickWithinOneWord(255, false);
                (0, expect_1.expect)(next).to.eq(511);
                (0, expect_1.expect)(initialized).to.eq(false);
            });
            it('returns the next words initialized tick if on the right boundary', async () => {
                const { next, initialized } = await tickBitmap.nextInitializedTickWithinOneWord(-257, false);
                (0, expect_1.expect)(next).to.eq(-200);
                (0, expect_1.expect)(initialized).to.eq(true);
            });
            it('returns the next initialized tick from the next word', async () => {
                await tickBitmap.flipTick(340);
                const { next, initialized } = await tickBitmap.nextInitializedTickWithinOneWord(328, false);
                (0, expect_1.expect)(next).to.eq(340);
                (0, expect_1.expect)(initialized).to.eq(true);
            });
            it('does not exceed boundary', async () => {
                const { next, initialized } = await tickBitmap.nextInitializedTickWithinOneWord(508, false);
                (0, expect_1.expect)(next).to.eq(511);
                (0, expect_1.expect)(initialized).to.eq(false);
            });
            it('skips entire word', async () => {
                const { next, initialized } = await tickBitmap.nextInitializedTickWithinOneWord(255, false);
                (0, expect_1.expect)(next).to.eq(511);
                (0, expect_1.expect)(initialized).to.eq(false);
            });
            it('skips half word', async () => {
                const { next, initialized } = await tickBitmap.nextInitializedTickWithinOneWord(383, false);
                (0, expect_1.expect)(next).to.eq(511);
                (0, expect_1.expect)(initialized).to.eq(false);
            });
            it('gas cost on boundary', async () => {
                await (0, snapshotGasCost_1.default)(await tickBitmap.getGasCostOfNextInitializedTickWithinOneWord(255, false));
            });
            it('gas cost just below boundary', async () => {
                await (0, snapshotGasCost_1.default)(await tickBitmap.getGasCostOfNextInitializedTickWithinOneWord(254, false));
            });
            it('gas cost for entire word', async () => {
                await (0, snapshotGasCost_1.default)(await tickBitmap.getGasCostOfNextInitializedTickWithinOneWord(768, false));
            });
        });
        describe('lte = true', () => {
            it('returns same tick if initialized', async () => {
                const { next, initialized } = await tickBitmap.nextInitializedTickWithinOneWord(78, true);
                (0, expect_1.expect)(next).to.eq(78);
                (0, expect_1.expect)(initialized).to.eq(true);
            });
            it('returns tick directly to the left of input tick if not initialized', async () => {
                const { next, initialized } = await tickBitmap.nextInitializedTickWithinOneWord(79, true);
                (0, expect_1.expect)(next).to.eq(78);
                (0, expect_1.expect)(initialized).to.eq(true);
            });
            it('will not exceed the word boundary', async () => {
                const { next, initialized } = await tickBitmap.nextInitializedTickWithinOneWord(258, true);
                (0, expect_1.expect)(next).to.eq(256);
                (0, expect_1.expect)(initialized).to.eq(false);
            });
            it('at the word boundary', async () => {
                const { next, initialized } = await tickBitmap.nextInitializedTickWithinOneWord(256, true);
                (0, expect_1.expect)(next).to.eq(256);
                (0, expect_1.expect)(initialized).to.eq(false);
            });
            it('word boundary less 1 (next initialized tick in next word)', async () => {
                const { next, initialized } = await tickBitmap.nextInitializedTickWithinOneWord(72, true);
                (0, expect_1.expect)(next).to.eq(70);
                (0, expect_1.expect)(initialized).to.eq(true);
            });
            it('word boundary', async () => {
                const { next, initialized } = await tickBitmap.nextInitializedTickWithinOneWord(-257, true);
                (0, expect_1.expect)(next).to.eq(-512);
                (0, expect_1.expect)(initialized).to.eq(false);
            });
            it('entire empty word', async () => {
                const { next, initialized } = await tickBitmap.nextInitializedTickWithinOneWord(1023, true);
                (0, expect_1.expect)(next).to.eq(768);
                (0, expect_1.expect)(initialized).to.eq(false);
            });
            it('halfway through empty word', async () => {
                const { next, initialized } = await tickBitmap.nextInitializedTickWithinOneWord(900, true);
                (0, expect_1.expect)(next).to.eq(768);
                (0, expect_1.expect)(initialized).to.eq(false);
            });
            it('boundary is initialized', async () => {
                await tickBitmap.flipTick(329);
                const { next, initialized } = await tickBitmap.nextInitializedTickWithinOneWord(456, true);
                (0, expect_1.expect)(next).to.eq(329);
                (0, expect_1.expect)(initialized).to.eq(true);
            });
            it('gas cost on boundary', async () => {
                await (0, snapshotGasCost_1.default)(await tickBitmap.getGasCostOfNextInitializedTickWithinOneWord(256, true));
            });
            it('gas cost just below boundary', async () => {
                await (0, snapshotGasCost_1.default)(await tickBitmap.getGasCostOfNextInitializedTickWithinOneWord(255, true));
            });
            it('gas cost for entire word', async () => {
                await (0, snapshotGasCost_1.default)(await tickBitmap.getGasCostOfNextInitializedTickWithinOneWord(1024, true));
            });
        });
    });
});
