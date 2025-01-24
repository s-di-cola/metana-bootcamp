"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const hardhat_1 = require("hardhat");
const expect_1 = require("./shared/expect");
const snapshotGasCost_1 = __importDefault(require("./shared/snapshotGasCost"));
const utilities_1 = require("./shared/utilities");
const decimal_js_1 = __importDefault(require("decimal.js"));
const MIN_TICK = -887272;
const MAX_TICK = 887272;
decimal_js_1.default.config({ toExpNeg: -500, toExpPos: 500 });
describe('TickMath', () => {
    let tickMath;
    before('deploy TickMathTest', async () => {
        const factory = await hardhat_1.ethers.getContractFactory('TickMathTest');
        tickMath = (await factory.deploy());
    });
    describe('#getSqrtRatioAtTick', () => {
        it('throws for too low', async () => {
            await (0, expect_1.expect)(tickMath.getSqrtRatioAtTick(MIN_TICK - 1)).to.be.revertedWith('T');
        });
        it('throws for too low', async () => {
            await (0, expect_1.expect)(tickMath.getSqrtRatioAtTick(MAX_TICK + 1)).to.be.revertedWith('T');
        });
        it('min tick', async () => {
            (0, expect_1.expect)(await tickMath.getSqrtRatioAtTick(MIN_TICK)).to.eq('4295128739');
        });
        it('min tick +1', async () => {
            (0, expect_1.expect)(await tickMath.getSqrtRatioAtTick(MIN_TICK + 1)).to.eq('4295343490');
        });
        it('max tick - 1', async () => {
            (0, expect_1.expect)(await tickMath.getSqrtRatioAtTick(MAX_TICK - 1)).to.eq('1461373636630004318706518188784493106690254656249');
        });
        it('min tick ratio is less than js implementation', async () => {
            (0, expect_1.expect)(await tickMath.getSqrtRatioAtTick(MIN_TICK)).to.be.lt((0, utilities_1.encodePriceSqrt)(1, ethers_1.BigNumber.from(2).pow(127)));
        });
        it('max tick ratio is greater than js implementation', async () => {
            (0, expect_1.expect)(await tickMath.getSqrtRatioAtTick(MAX_TICK)).to.be.gt((0, utilities_1.encodePriceSqrt)(ethers_1.BigNumber.from(2).pow(127), 1));
        });
        it('max tick', async () => {
            (0, expect_1.expect)(await tickMath.getSqrtRatioAtTick(MAX_TICK)).to.eq('1461446703485210103287273052203988822378723970342');
        });
        for (const absTick of [
            50, 100, 250, 500, 1000, 2500, 3000, 4000, 5000, 50000, 150000, 250000, 500000, 738203,
        ]) {
            for (const tick of [-absTick, absTick]) {
                describe(`tick ${tick}`, () => {
                    it('is at most off by 1/100th of a bips', async () => {
                        const jsResult = new decimal_js_1.default(1.0001).pow(tick).sqrt().mul(new decimal_js_1.default(2).pow(96));
                        const result = await tickMath.getSqrtRatioAtTick(tick);
                        const absDiff = new decimal_js_1.default(result.toString()).sub(jsResult).abs();
                        (0, expect_1.expect)(absDiff.div(jsResult).toNumber()).to.be.lt(0.000001);
                    });
                    it('result', async () => {
                        (0, expect_1.expect)((await tickMath.getSqrtRatioAtTick(tick)).toString()).to.matchSnapshot();
                    });
                    it('gas', async () => {
                        await (0, snapshotGasCost_1.default)(tickMath.getGasCostOfGetSqrtRatioAtTick(tick));
                    });
                });
            }
        }
    });
    describe('#MIN_SQRT_RATIO', async () => {
        it('equals #getSqrtRatioAtTick(MIN_TICK)', async () => {
            const min = await tickMath.getSqrtRatioAtTick(MIN_TICK);
            (0, expect_1.expect)(min).to.eq(await tickMath.MIN_SQRT_RATIO());
            (0, expect_1.expect)(min).to.eq(utilities_1.MIN_SQRT_RATIO);
        });
    });
    describe('#MAX_SQRT_RATIO', async () => {
        it('equals #getSqrtRatioAtTick(MAX_TICK)', async () => {
            const max = await tickMath.getSqrtRatioAtTick(MAX_TICK);
            (0, expect_1.expect)(max).to.eq(await tickMath.MAX_SQRT_RATIO());
            (0, expect_1.expect)(max).to.eq(utilities_1.MAX_SQRT_RATIO);
        });
    });
    describe('#getTickAtSqrtRatio', () => {
        it('throws for too low', async () => {
            await (0, expect_1.expect)(tickMath.getTickAtSqrtRatio(utilities_1.MIN_SQRT_RATIO.sub(1))).to.be.revertedWith('R');
        });
        it('throws for too high', async () => {
            await (0, expect_1.expect)(tickMath.getTickAtSqrtRatio(ethers_1.BigNumber.from(utilities_1.MAX_SQRT_RATIO))).to.be.revertedWith('R');
        });
        it('ratio of min tick', async () => {
            (0, expect_1.expect)(await tickMath.getTickAtSqrtRatio(utilities_1.MIN_SQRT_RATIO)).to.eq(MIN_TICK);
        });
        it('ratio of min tick + 1', async () => {
            (0, expect_1.expect)(await tickMath.getTickAtSqrtRatio('4295343490')).to.eq(MIN_TICK + 1);
        });
        it('ratio of max tick - 1', async () => {
            (0, expect_1.expect)(await tickMath.getTickAtSqrtRatio('1461373636630004318706518188784493106690254656249')).to.eq(MAX_TICK - 1);
        });
        it('ratio closest to max tick', async () => {
            (0, expect_1.expect)(await tickMath.getTickAtSqrtRatio(utilities_1.MAX_SQRT_RATIO.sub(1))).to.eq(MAX_TICK - 1);
        });
        for (const ratio of [
            utilities_1.MIN_SQRT_RATIO,
            (0, utilities_1.encodePriceSqrt)(ethers_1.BigNumber.from(10).pow(12), 1),
            (0, utilities_1.encodePriceSqrt)(ethers_1.BigNumber.from(10).pow(6), 1),
            (0, utilities_1.encodePriceSqrt)(1, 64),
            (0, utilities_1.encodePriceSqrt)(1, 8),
            (0, utilities_1.encodePriceSqrt)(1, 2),
            (0, utilities_1.encodePriceSqrt)(1, 1),
            (0, utilities_1.encodePriceSqrt)(2, 1),
            (0, utilities_1.encodePriceSqrt)(8, 1),
            (0, utilities_1.encodePriceSqrt)(64, 1),
            (0, utilities_1.encodePriceSqrt)(1, ethers_1.BigNumber.from(10).pow(6)),
            (0, utilities_1.encodePriceSqrt)(1, ethers_1.BigNumber.from(10).pow(12)),
            utilities_1.MAX_SQRT_RATIO.sub(1),
        ]) {
            describe(`ratio ${ratio}`, () => {
                it('is at most off by 1', async () => {
                    const jsResult = new decimal_js_1.default(ratio.toString()).div(new decimal_js_1.default(2).pow(96)).pow(2).log(1.0001).floor();
                    const result = await tickMath.getTickAtSqrtRatio(ratio);
                    const absDiff = new decimal_js_1.default(result.toString()).sub(jsResult).abs();
                    (0, expect_1.expect)(absDiff.toNumber()).to.be.lte(1);
                });
                it('ratio is between the tick and tick+1', async () => {
                    const tick = await tickMath.getTickAtSqrtRatio(ratio);
                    const ratioOfTick = await tickMath.getSqrtRatioAtTick(tick);
                    const ratioOfTickPlusOne = await tickMath.getSqrtRatioAtTick(tick + 1);
                    (0, expect_1.expect)(ratio).to.be.gte(ratioOfTick);
                    (0, expect_1.expect)(ratio).to.be.lt(ratioOfTickPlusOne);
                });
                it('result', async () => {
                    (0, expect_1.expect)(await tickMath.getTickAtSqrtRatio(ratio)).to.matchSnapshot();
                });
                it('gas', async () => {
                    await (0, snapshotGasCost_1.default)(tickMath.getGasCostOfGetTickAtSqrtRatio(ratio));
                });
            });
        }
    });
});
