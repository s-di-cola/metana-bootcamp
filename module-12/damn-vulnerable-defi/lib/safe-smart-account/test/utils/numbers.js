"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomIntAsString = exports.getRandomInt = void 0;
var getRandomInt = function (min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = Number.MAX_SAFE_INTEGER; }
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.getRandomInt = getRandomInt;
var getRandomIntAsString = function (min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = Number.MAX_SAFE_INTEGER; }
    return getRandomInt(min, max).toString();
};
exports.getRandomIntAsString = getRandomIntAsString;
