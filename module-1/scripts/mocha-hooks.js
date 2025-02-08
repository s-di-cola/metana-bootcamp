"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mochaHooks = void 0;
const hardhat_1 = __importDefault(require("hardhat"));
exports.mochaHooks = {
    beforeAll: async function () {
        console.log("Compiling contracts...");
        await hardhat_1.default.run("compile");
        console.log("Compilation finished.");
    },
};
