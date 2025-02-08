"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = checkObservationEquals;
var expect_1 = require("./expect");
// helper function because we cannot do a simple deep equals with the
// observation result object returned from ethers because it extends array
function checkObservationEquals(_a, expected) {
    var tickCumulative = _a.tickCumulative, blockTimestamp = _a.blockTimestamp, initialized = _a.initialized, secondsPerLiquidityCumulativeX128 = _a.secondsPerLiquidityCumulativeX128;
    (0, expect_1.expect)({
        initialized: initialized,
        blockTimestamp: blockTimestamp,
        tickCumulative: tickCumulative.toString(),
        secondsPerLiquidityCumulativeX128: secondsPerLiquidityCumulativeX128.toString(),
    }, "observation is equivalent").to.deep.eq(__assign(__assign({}, expected), { tickCumulative: expected.tickCumulative.toString(), secondsPerLiquidityCumulativeX128: expected.secondsPerLiquidityCumulativeX128.toString() }));
}
