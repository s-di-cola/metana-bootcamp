"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const encodePriceSqrt_1 = require("./encodePriceSqrt");
const expect_1 = require("./expect");
const formatSqrtRatioX96_1 = require("./formatSqrtRatioX96");
describe('#formatSqrtRatioX96', () => {
    it('is correct for 9_999_999/10_000_000', () => {
        (0, expect_1.expect)((0, formatSqrtRatioX96_1.formatSqrtRatioX96)((0, encodePriceSqrt_1.encodePriceSqrt)(9999999, 10000000))).to.eq('1.0000');
    });
    it('is correct for 9_999_999/1', () => {
        (0, expect_1.expect)((0, formatSqrtRatioX96_1.formatSqrtRatioX96)((0, encodePriceSqrt_1.encodePriceSqrt)(9999999, 1))).to.eq('10000000');
    });
    it('is correct for 1/3', () => {
        (0, expect_1.expect)((0, formatSqrtRatioX96_1.formatSqrtRatioX96)((0, encodePriceSqrt_1.encodePriceSqrt)(1, 3))).to.eq('0.33333');
    });
    it('is correct for 100/3', () => {
        (0, expect_1.expect)((0, formatSqrtRatioX96_1.formatSqrtRatioX96)((0, encodePriceSqrt_1.encodePriceSqrt)(100, 3))).to.eq('33.333');
    });
    it('is correct for 1_000_000/3', () => {
        (0, expect_1.expect)((0, formatSqrtRatioX96_1.formatSqrtRatioX96)((0, encodePriceSqrt_1.encodePriceSqrt)(1000000, 3))).to.eq('333330');
    });
    it('1e-18 still prints 5 sig figs', () => {
        (0, expect_1.expect)((0, formatSqrtRatioX96_1.formatSqrtRatioX96)((0, encodePriceSqrt_1.encodePriceSqrt)(1, 1e18), 18, 18)).to.eq('0.0000000000000000010000');
    });
    it('accounts for decimal differences', () => {
        (0, expect_1.expect)((0, formatSqrtRatioX96_1.formatSqrtRatioX96)((0, encodePriceSqrt_1.encodePriceSqrt)(1e6, 1e18), 18, 6)).to.eq('1.0000');
    });
    it('accounts for decimal differences in reverse', () => {
        (0, expect_1.expect)((0, formatSqrtRatioX96_1.formatSqrtRatioX96)((0, encodePriceSqrt_1.encodePriceSqrt)(1e18, 1e6), 6, 18)).to.eq('1.0000');
    });
});
