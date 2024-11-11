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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.listenForNewTransactions = exports.fetchTotalTransferVolumeForRecentBlocks = void 0;
var alchemy_sdk_1 = require("alchemy-sdk");
var keccak256_1 = require("@ethersproject/keccak256");
var strings_1 = require("@ethersproject/strings");
require("dotenv/config");
var TRANSFER_TOPIC = (0, keccak256_1.keccak256)((0, strings_1.toUtf8Bytes)("Transfer(address,address,uint256)"));
var ALCHEMY_KEY = process.env.ALCHEMY_API_KEY;
var USDT_CONTRACT = "0xdac17f958d2ee523a2206206994597c13d831ec7";
var settings = {
    apiKey: ALCHEMY_KEY,
    network: alchemy_sdk_1.Network.ETH_MAINNET,
};
var alchemy = new alchemy_sdk_1.Alchemy(settings);
function getTotalVolumeOfTransfers(blockNumber) {
    return __awaiter(this, void 0, void 0, function () {
        var block, transactions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, alchemy.core.getBlockWithTransactions(blockNumber)];
                case 1:
                    block = _a.sent();
                    return [4 /*yield*/, alchemy.core.getLogs({
                            fromBlock: block.number,
                            toBlock: block.number,
                            address: USDT_CONTRACT,
                            topics: [TRANSFER_TOPIC],
                        })];
                case 2:
                    transactions = _a.sent();
                    return [2 /*return*/, {
                            block: block.number,
                            transactions: transactions.length,
                            totalValue: transactions.reduce(function (acc, curr) { return acc + parseInt(curr.data); }, 0),
                            baseFee: block.baseFeePerGas.toNumber(),
                            gasUsed: block.gasUsed.toNumber(),
                            gasLimit: block.gasLimit.toNumber(),
                            gasUsedOverLimit: (block.gasUsed.toNumber() / block.gasLimit.toNumber()) * 100,
                        }];
            }
        });
    });
}
function fetchTotalTransferVolumeForRecentBlocks(amount) {
    return __awaiter(this, void 0, void 0, function () {
        var latestBlock, data, i, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, alchemy.core.getBlockNumber()];
                case 1:
                    latestBlock = _c.sent();
                    data = [];
                    i = 0;
                    _c.label = 2;
                case 2:
                    if (!(i < amount)) return [3 /*break*/, 5];
                    _b = (_a = data).push;
                    return [4 /*yield*/, getTotalVolumeOfTransfers(latestBlock - i)];
                case 3:
                    _b.apply(_a, [_c.sent()]);
                    _c.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, data.reverse()];
            }
        });
    });
}
exports.fetchTotalTransferVolumeForRecentBlocks = fetchTotalTransferVolumeForRecentBlocks;
function listenForNewTransactions(callback) {
    var _this = this;
    var processedBlocks = new Set();
    alchemy.ws.on({
        address: USDT_CONTRACT,
        topics: [TRANSFER_TOPIC],
    }, function (log) { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!!processedBlocks.has(log.blockNumber)) return [3 /*break*/, 2];
                    processedBlocks.add(log.blockNumber);
                    _a = callback;
                    return [4 /*yield*/, getTotalVolumeOfTransfers(log.blockNumber)];
                case 1:
                    _a.apply(void 0, [_b.sent()]);
                    _b.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
}
exports.listenForNewTransactions = listenForNewTransactions;
