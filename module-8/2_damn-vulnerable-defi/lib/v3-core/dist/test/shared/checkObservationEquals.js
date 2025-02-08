"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expect_1 = require("./expect");
// helper function because we cannot do a simple deep equals with the
// observation result object returned from ethers because it extends array
function checkObservationEquals({ tickCumulative, blockTimestamp, initialized, secondsPerLiquidityCumulativeX128, }, expected) {
    (0, expect_1.expect)({
        initialized,
        blockTimestamp,
        tickCumulative: tickCumulative.toString(),
        secondsPerLiquidityCumulativeX128: secondsPerLiquidityCumulativeX128.toString(),
    }, `observation is equivalent`).to.deep.eq({
        ...expected,
        tickCumulative: expected.tickCumulative.toString(),
        secondsPerLiquidityCumulativeX128: expected.secondsPerLiquidityCumulativeX128.toString(),
    });
}
exports.default = checkObservationEquals;
