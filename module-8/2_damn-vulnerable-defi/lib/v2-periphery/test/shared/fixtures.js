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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.v2Fixture = void 0;
var ethers_1 = require("ethers");
var ethereum_waffle_1 = require("ethereum-waffle");
var utilities_1 = require("./utilities");
var UniswapV2Factory_json_1 = __importDefault(require("@uniswap/v2-core/build/UniswapV2Factory.json"));
var IUniswapV2Pair_json_1 = __importDefault(require("@uniswap/v2-core/build/IUniswapV2Pair.json"));
var ERC20_json_1 = __importDefault(require("../../build/ERC20.json"));
var WETH9_json_1 = __importDefault(require("../../build/WETH9.json"));
var UniswapV1Exchange_json_1 = __importDefault(require("../../build/UniswapV1Exchange.json"));
var UniswapV1Factory_json_1 = __importDefault(require("../../build/UniswapV1Factory.json"));
var UniswapV2Router01_json_1 = __importDefault(require("../../build/UniswapV2Router01.json"));
var UniswapV2Migrator_json_1 = __importDefault(require("../../build/UniswapV2Migrator.json"));
var UniswapV2Router02_json_1 = __importDefault(require("../../build/UniswapV2Router02.json"));
var RouterEventEmitter_json_1 = __importDefault(require("../../build/RouterEventEmitter.json"));
var overrides = {
    gasLimit: 9999999
};
function v2Fixture(provider_1, _a) {
    return __awaiter(this, arguments, void 0, function (provider, _b) {
        var tokenA, tokenB, WETH, WETHPartner, factoryV1, _c, _d, factoryV2, router01, router02, routerEventEmitter, migrator, WETHExchangeV1Address, WETHExchangeV1, pairAddress, pair, token0Address, token0, token1, WETHPairAddress, WETHPair;
        var wallet = _b[0];
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, ethereum_waffle_1.deployContract)(wallet, ERC20_json_1.default, [(0, utilities_1.expandTo18Decimals)(10000)])];
                case 1:
                    tokenA = _e.sent();
                    return [4 /*yield*/, (0, ethereum_waffle_1.deployContract)(wallet, ERC20_json_1.default, [(0, utilities_1.expandTo18Decimals)(10000)])];
                case 2:
                    tokenB = _e.sent();
                    return [4 /*yield*/, (0, ethereum_waffle_1.deployContract)(wallet, WETH9_json_1.default)];
                case 3:
                    WETH = _e.sent();
                    return [4 /*yield*/, (0, ethereum_waffle_1.deployContract)(wallet, ERC20_json_1.default, [(0, utilities_1.expandTo18Decimals)(10000)])
                        // deploy V1
                    ];
                case 4:
                    WETHPartner = _e.sent();
                    return [4 /*yield*/, (0, ethereum_waffle_1.deployContract)(wallet, UniswapV1Factory_json_1.default, [])];
                case 5:
                    factoryV1 = _e.sent();
                    _d = (_c = factoryV1).initializeFactory;
                    return [4 /*yield*/, (0, ethereum_waffle_1.deployContract)(wallet, UniswapV1Exchange_json_1.default, [])];
                case 6: return [4 /*yield*/, _d.apply(_c, [(_e.sent()).address])
                    // deploy V2
                ];
                case 7:
                    _e.sent();
                    return [4 /*yield*/, (0, ethereum_waffle_1.deployContract)(wallet, UniswapV2Factory_json_1.default, [wallet.address])
                        // deploy routers
                    ];
                case 8:
                    factoryV2 = _e.sent();
                    return [4 /*yield*/, (0, ethereum_waffle_1.deployContract)(wallet, UniswapV2Router01_json_1.default, [factoryV2.address, WETH.address], overrides)];
                case 9:
                    router01 = _e.sent();
                    return [4 /*yield*/, (0, ethereum_waffle_1.deployContract)(wallet, UniswapV2Router02_json_1.default, [factoryV2.address, WETH.address], overrides)
                        // event emitter for testing
                    ];
                case 10:
                    router02 = _e.sent();
                    return [4 /*yield*/, (0, ethereum_waffle_1.deployContract)(wallet, RouterEventEmitter_json_1.default, [])
                        // deploy migrator
                    ];
                case 11:
                    routerEventEmitter = _e.sent();
                    return [4 /*yield*/, (0, ethereum_waffle_1.deployContract)(wallet, UniswapV2Migrator_json_1.default, [factoryV1.address, router01.address], overrides)
                        // initialize V1
                    ];
                case 12:
                    migrator = _e.sent();
                    // initialize V1
                    return [4 /*yield*/, factoryV1.createExchange(WETHPartner.address, overrides)];
                case 13:
                    // initialize V1
                    _e.sent();
                    return [4 /*yield*/, factoryV1.getExchange(WETHPartner.address)];
                case 14:
                    WETHExchangeV1Address = _e.sent();
                    WETHExchangeV1 = new ethers_1.Contract(WETHExchangeV1Address, JSON.stringify(UniswapV1Exchange_json_1.default.abi), provider).connect(wallet);
                    // initialize V2
                    return [4 /*yield*/, factoryV2.createPair(tokenA.address, tokenB.address)];
                case 15:
                    // initialize V2
                    _e.sent();
                    return [4 /*yield*/, factoryV2.getPair(tokenA.address, tokenB.address)];
                case 16:
                    pairAddress = _e.sent();
                    pair = new ethers_1.Contract(pairAddress, JSON.stringify(IUniswapV2Pair_json_1.default.abi), provider).connect(wallet);
                    return [4 /*yield*/, pair.token0()];
                case 17:
                    token0Address = _e.sent();
                    token0 = tokenA.address === token0Address ? tokenA : tokenB;
                    token1 = tokenA.address === token0Address ? tokenB : tokenA;
                    return [4 /*yield*/, factoryV2.createPair(WETH.address, WETHPartner.address)];
                case 18:
                    _e.sent();
                    return [4 /*yield*/, factoryV2.getPair(WETH.address, WETHPartner.address)];
                case 19:
                    WETHPairAddress = _e.sent();
                    WETHPair = new ethers_1.Contract(WETHPairAddress, JSON.stringify(IUniswapV2Pair_json_1.default.abi), provider).connect(wallet);
                    return [2 /*return*/, {
                            token0: token0,
                            token1: token1,
                            WETH: WETH,
                            WETHPartner: WETHPartner,
                            factoryV1: factoryV1,
                            factoryV2: factoryV2,
                            router01: router01,
                            router02: router02,
                            router: router02, // the default router, 01 had a minor bug
                            routerEventEmitter: routerEventEmitter,
                            migrator: migrator,
                            WETHExchangeV1: WETHExchangeV1,
                            pair: pair,
                            WETHPair: WETHPair
                        }];
            }
        });
    });
}
exports.v2Fixture = v2Fixture;
