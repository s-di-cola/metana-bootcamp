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
exports.default = getPermitNFTSignature;
var ethers_1 = require("ethers");
var utils_1 = require("ethers/lib/utils");
function getPermitNFTSignature(wallet_1, positionManager_1, spender_1, tokenId_1) {
    return __awaiter(this, arguments, void 0, function (wallet, positionManager, spender, tokenId, deadline, permitConfig) {
        var _a, nonce, name, version, chainId, _b;
        var _c, _d, _e, _f;
        if (deadline === void 0) { deadline = ethers_1.constants.MaxUint256; }
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        (_c = permitConfig === null || permitConfig === void 0 ? void 0 : permitConfig.nonce) !== null && _c !== void 0 ? _c : positionManager.positions(tokenId).then(function (p) { return p.nonce; }),
                        (_d = permitConfig === null || permitConfig === void 0 ? void 0 : permitConfig.name) !== null && _d !== void 0 ? _d : positionManager.name(),
                        (_e = permitConfig === null || permitConfig === void 0 ? void 0 : permitConfig.version) !== null && _e !== void 0 ? _e : '1',
                        (_f = permitConfig === null || permitConfig === void 0 ? void 0 : permitConfig.chainId) !== null && _f !== void 0 ? _f : wallet.getChainId(),
                    ])];
                case 1:
                    _a = _g.sent(), nonce = _a[0], name = _a[1], version = _a[2], chainId = _a[3];
                    _b = utils_1.splitSignature;
                    return [4 /*yield*/, wallet._signTypedData({
                            name: name,
                            version: version,
                            chainId: chainId,
                            verifyingContract: positionManager.address,
                        }, {
                            Permit: [
                                {
                                    name: 'spender',
                                    type: 'address',
                                },
                                {
                                    name: 'tokenId',
                                    type: 'uint256',
                                },
                                {
                                    name: 'nonce',
                                    type: 'uint256',
                                },
                                {
                                    name: 'deadline',
                                    type: 'uint256',
                                },
                            ],
                        }, {
                            owner: wallet.address,
                            spender: spender,
                            tokenId: tokenId,
                            nonce: nonce,
                            deadline: deadline,
                        })];
                case 2: return [2 /*return*/, _b.apply(void 0, [_g.sent()])];
            }
        });
    });
}
