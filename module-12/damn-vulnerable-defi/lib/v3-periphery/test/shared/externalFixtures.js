"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.v3RouterFixture = exports.v2FactoryFixture = void 0;
var UniswapV3Factory_json_1 = require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json");
var UniswapV2Factory_json_1 = require("@uniswap/v2-core/build/UniswapV2Factory.json");
var hardhat_1 = require("hardhat");
var WETH9_json_1 = require("../contracts/WETH9.json");
var ethers_1 = require("ethers");
var wethFixture = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var weth9;
    var wallet = _b[0];
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, hardhat_1.waffle.deployContract(wallet, {
                    bytecode: WETH9_json_1.default.bytecode,
                    abi: WETH9_json_1.default.abi,
                })];
            case 1:
                weth9 = (_c.sent());
                return [2 /*return*/, { weth9: weth9 }];
        }
    });
}); };
var v2FactoryFixture = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var factory;
    var wallet = _b[0];
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, hardhat_1.waffle.deployContract(wallet, {
                    bytecode: UniswapV2Factory_json_1.bytecode,
                    abi: UniswapV2Factory_json_1.abi,
                }, [ethers_1.constants.AddressZero])];
            case 1:
                factory = _c.sent();
                return [2 /*return*/, { factory: factory }];
        }
    });
}); };
exports.v2FactoryFixture = v2FactoryFixture;
var v3CoreFactoryFixture = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var wallet = _b[0];
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, hardhat_1.waffle.deployContract(wallet, {
                    bytecode: UniswapV3Factory_json_1.bytecode,
                    abi: UniswapV3Factory_json_1.abi,
                })];
            case 1: return [2 /*return*/, (_c.sent())];
        }
    });
}); };
var v3RouterFixture = function (_a, provider_1) { return __awaiter(void 0, [_a, provider_1], void 0, function (_b, provider) {
    var weth9, factory, router;
    var wallet = _b[0];
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, wethFixture([wallet], provider)];
            case 1:
                weth9 = (_c.sent()).weth9;
                return [4 /*yield*/, v3CoreFactoryFixture([wallet], provider)];
            case 2:
                factory = _c.sent();
                return [4 /*yield*/, hardhat_1.ethers.getContractFactory('MockTimeSwapRouter')];
            case 3: return [4 /*yield*/, (_c.sent()).deploy(factory.address, weth9.address)];
            case 4:
                router = (_c.sent());
                return [2 /*return*/, { factory: factory, weth9: weth9, router: router }];
        }
    });
}); };
exports.v3RouterFixture = v3RouterFixture;
