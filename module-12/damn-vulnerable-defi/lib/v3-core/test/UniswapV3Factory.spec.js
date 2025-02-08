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
var hardhat_1 = require("hardhat");
var expect_1 = require("./shared/expect");
var snapshotGasCost_1 = require("./shared/snapshotGasCost");
var utilities_1 = require("./shared/utilities");
var constants = hardhat_1.ethers.constants;
var TEST_ADDRESSES = [
    '0x1000000000000000000000000000000000000000',
    '0x2000000000000000000000000000000000000000',
];
var createFixtureLoader = hardhat_1.waffle.createFixtureLoader;
describe('UniswapV3Factory', function () {
    var wallet, other;
    var factory;
    var poolBytecode;
    var fixture = function () { return __awaiter(void 0, void 0, void 0, function () {
        var factoryFactory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('UniswapV3Factory')];
                case 1:
                    factoryFactory = _a.sent();
                    return [4 /*yield*/, factoryFactory.deploy()];
                case 2: return [2 /*return*/, (_a.sent())];
            }
        });
    }); };
    var loadFixture;
    before('create fixture loader', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ;
                    return [4 /*yield*/, hardhat_1.ethers.getSigners()];
                case 1:
                    _a = _b.sent(), wallet = _a[0], other = _a[1];
                    loadFixture = createFixtureLoader([wallet, other]);
                    return [2 /*return*/];
            }
        });
    }); });
    before('load pool bytecode', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('UniswapV3Pool')];
                case 1:
                    poolBytecode = (_a.sent()).bytecode;
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach('deploy factory', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadFixture(fixture)];
                case 1:
                    factory = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('owner is deployer', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = expect_1.expect;
                    return [4 /*yield*/, factory.owner()];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eq(wallet.address);
                    return [2 /*return*/];
            }
        });
    }); });
    it('factory bytecode size', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = expect_1.expect;
                    return [4 /*yield*/, hardhat_1.waffle.provider.getCode(factory.address)];
                case 1:
                    _a.apply(void 0, [((_b.sent()).length - 2) / 2]).to.matchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    it('pool bytecode size', function () { return __awaiter(void 0, void 0, void 0, function () {
        var poolAddress, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, factory.createPool(TEST_ADDRESSES[0], TEST_ADDRESSES[1], utilities_1.FeeAmount.MEDIUM)];
                case 1:
                    _b.sent();
                    poolAddress = (0, utilities_1.getCreate2Address)(factory.address, TEST_ADDRESSES, utilities_1.FeeAmount.MEDIUM, poolBytecode);
                    _a = expect_1.expect;
                    return [4 /*yield*/, hardhat_1.waffle.provider.getCode(poolAddress)];
                case 2:
                    _a.apply(void 0, [((_b.sent()).length - 2) / 2]).to.matchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    it('initial enabled fee amounts', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = expect_1.expect;
                    return [4 /*yield*/, factory.feeAmountTickSpacing(utilities_1.FeeAmount.LOW)];
                case 1:
                    _a.apply(void 0, [_d.sent()]).to.eq(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.LOW]);
                    _b = expect_1.expect;
                    return [4 /*yield*/, factory.feeAmountTickSpacing(utilities_1.FeeAmount.MEDIUM)];
                case 2:
                    _b.apply(void 0, [_d.sent()]).to.eq(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]);
                    _c = expect_1.expect;
                    return [4 /*yield*/, factory.feeAmountTickSpacing(utilities_1.FeeAmount.HIGH)];
                case 3:
                    _c.apply(void 0, [_d.sent()]).to.eq(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.HIGH]);
                    return [2 /*return*/];
            }
        });
    }); });
    function createAndCheckPool(tokens_1, feeAmount_1) {
        return __awaiter(this, arguments, void 0, function (tokens, feeAmount, tickSpacing) {
            var create2Address, create, _a, _b, poolContractFactory, pool, _c, _d, _e, _f, _g;
            if (tickSpacing === void 0) { tickSpacing = utilities_1.TICK_SPACINGS[feeAmount]; }
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        create2Address = (0, utilities_1.getCreate2Address)(factory.address, tokens, feeAmount, poolBytecode);
                        create = factory.createPool(tokens[0], tokens[1], feeAmount);
                        return [4 /*yield*/, (0, expect_1.expect)(create)
                                .to.emit(factory, 'PoolCreated')
                                .withArgs(TEST_ADDRESSES[0], TEST_ADDRESSES[1], feeAmount, tickSpacing, create2Address)];
                    case 1:
                        _h.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(factory.createPool(tokens[0], tokens[1], feeAmount)).to.be.reverted];
                    case 2:
                        _h.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(factory.createPool(tokens[1], tokens[0], feeAmount)).to.be.reverted];
                    case 3:
                        _h.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, factory.getPool(tokens[0], tokens[1], feeAmount)];
                    case 4:
                        _a.apply(void 0, [_h.sent(), 'getPool in order']).to.eq(create2Address);
                        _b = expect_1.expect;
                        return [4 /*yield*/, factory.getPool(tokens[1], tokens[0], feeAmount)];
                    case 5:
                        _b.apply(void 0, [_h.sent(), 'getPool in reverse']).to.eq(create2Address);
                        return [4 /*yield*/, hardhat_1.ethers.getContractFactory('UniswapV3Pool')];
                    case 6:
                        poolContractFactory = _h.sent();
                        pool = poolContractFactory.attach(create2Address);
                        _c = expect_1.expect;
                        return [4 /*yield*/, pool.factory()];
                    case 7:
                        _c.apply(void 0, [_h.sent(), 'pool factory address']).to.eq(factory.address);
                        _d = expect_1.expect;
                        return [4 /*yield*/, pool.token0()];
                    case 8:
                        _d.apply(void 0, [_h.sent(), 'pool token0']).to.eq(TEST_ADDRESSES[0]);
                        _e = expect_1.expect;
                        return [4 /*yield*/, pool.token1()];
                    case 9:
                        _e.apply(void 0, [_h.sent(), 'pool token1']).to.eq(TEST_ADDRESSES[1]);
                        _f = expect_1.expect;
                        return [4 /*yield*/, pool.fee()];
                    case 10:
                        _f.apply(void 0, [_h.sent(), 'pool fee']).to.eq(feeAmount);
                        _g = expect_1.expect;
                        return [4 /*yield*/, pool.tickSpacing()];
                    case 11:
                        _g.apply(void 0, [_h.sent(), 'pool tick spacing']).to.eq(tickSpacing);
                        return [2 /*return*/];
                }
            });
        });
    }
    describe('#createPool', function () {
        it('succeeds for low fee pool', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createAndCheckPool(TEST_ADDRESSES, utilities_1.FeeAmount.LOW)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('succeeds for medium fee pool', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createAndCheckPool(TEST_ADDRESSES, utilities_1.FeeAmount.MEDIUM)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('succeeds for high fee pool', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createAndCheckPool(TEST_ADDRESSES, utilities_1.FeeAmount.HIGH)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('succeeds if tokens are passed in reverse', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createAndCheckPool([TEST_ADDRESSES[1], TEST_ADDRESSES[0]], utilities_1.FeeAmount.MEDIUM)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails if token a == token b', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(factory.createPool(TEST_ADDRESSES[0], TEST_ADDRESSES[0], utilities_1.FeeAmount.LOW)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails if token a is 0 or token b is 0', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(factory.createPool(TEST_ADDRESSES[0], constants.AddressZero, utilities_1.FeeAmount.LOW)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(factory.createPool(constants.AddressZero, TEST_ADDRESSES[0], utilities_1.FeeAmount.LOW)).to.be.reverted];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(factory.createPool(constants.AddressZero, constants.AddressZero, utilities_1.FeeAmount.LOW)).to.be.revertedWith('')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails if fee amount is not enabled', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(factory.createPool(TEST_ADDRESSES[0], TEST_ADDRESSES[1], 250)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(factory.createPool(TEST_ADDRESSES[0], TEST_ADDRESSES[1], utilities_1.FeeAmount.MEDIUM))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#setOwner', function () {
        it('fails if caller is not owner', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(factory.connect(other).setOwner(wallet.address)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('updates owner', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, factory.setOwner(other.address)];
                    case 1:
                        _b.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, factory.owner()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).to.eq(other.address);
                        return [2 /*return*/];
                }
            });
        }); });
        it('emits event', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(factory.setOwner(other.address))
                            .to.emit(factory, 'OwnerChanged')
                            .withArgs(wallet.address, other.address)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('cannot be called by original owner', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, factory.setOwner(other.address)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(factory.setOwner(wallet.address)).to.be.reverted];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#enableFeeAmount', function () {
        it('fails if caller is not owner', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(factory.connect(other).enableFeeAmount(100, 2)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails if fee is too great', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(factory.enableFeeAmount(1000000, 10)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails if tick spacing is too small', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(factory.enableFeeAmount(500, 0)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails if tick spacing is too large', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(factory.enableFeeAmount(500, 16834)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails if already initialized', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, factory.enableFeeAmount(100, 5)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(factory.enableFeeAmount(100, 10)).to.be.reverted];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('sets the fee amount in the mapping', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, factory.enableFeeAmount(100, 5)];
                    case 1:
                        _b.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, factory.feeAmountTickSpacing(100)];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).to.eq(5);
                        return [2 /*return*/];
                }
            });
        }); });
        it('emits an event', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(factory.enableFeeAmount(100, 5)).to.emit(factory, 'FeeAmountEnabled').withArgs(100, 5)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('enables pool creation', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, factory.enableFeeAmount(250, 15)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, createAndCheckPool([TEST_ADDRESSES[0], TEST_ADDRESSES[1]], 250, 15)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
