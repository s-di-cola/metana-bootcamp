"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expect = void 0;
var chai_1 = require("chai");
Object.defineProperty(exports, "expect", { enumerable: true, get: function () { return chai_1.expect; } });
var ethereum_waffle_1 = require("ethereum-waffle");
var mocha_chai_jest_snapshot_1 = require("mocha-chai-jest-snapshot");
(0, chai_1.use)(ethereum_waffle_1.solidity);
(0, chai_1.use)((0, mocha_chai_jest_snapshot_1.jestSnapshotPlugin)());
