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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var apexcharts_1 = require("apexcharts");
var alchemy_sdk_1 = require("alchemy-sdk");
var usdt_tx_1 = require("./usdt-tx");
(function () {
    return __awaiter(this, void 0, void 0, function () {
        var blockTransactions, labels, totalValues, transactionCounts, baseFees, gasRatio, createChart, mainChart, baseFeeChart, gasRatioChart;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, usdt_tx_1.fetchTotalTransferVolumeForRecentBlocks)(10)];
                case 1:
                    blockTransactions = _a.sent();
                    console.log("Block Transactions:", blockTransactions);
                    labels = blockTransactions.map(function (tx) { return tx.block.toString(); });
                    totalValues = blockTransactions.map(function (tx) {
                        return parseFloat(alchemy_sdk_1.Utils.formatUnits(tx.totalValue, 6));
                    });
                    transactionCounts = blockTransactions.map(function (tx) { return tx.transactions; });
                    baseFees = blockTransactions.map(function (tx) { return tx.baseFee / 1e9; });
                    gasRatio = blockTransactions.map(function (tx) { return tx.gasUsedOverLimit; });
                    createChart = function (elementId, series, yAxisTitles, chartTypes, height) {
                        if (height === void 0) { height = 350; }
                        var options = {
                            series: series,
                            chart: {
                                height: height,
                                type: "line",
                                stacked: false,
                                id: elementId.replace("#", ""),
                                group: "txStats",
                                zoom: {
                                    type: "x",
                                    enabled: true,
                                    autoScaleYaxis: true,
                                },
                                toolbar: {
                                    autoSelected: "zoom",
                                },
                            },
                            dataLabels: {
                                enabled: false,
                            },
                            stroke: {
                                curve: "smooth",
                                width: 2,
                            },
                            xaxis: {
                                categories: labels,
                                title: {
                                    text: "Block Number",
                                },
                            },
                            yaxis: yAxisTitles.map(function (title, index) { return ({
                                title: {
                                    text: title,
                                },
                                opposite: index !== 0,
                                labels: {
                                    formatter: function (value) {
                                        return value.toFixed(2);
                                    },
                                },
                            }); }),
                            tooltip: {
                                shared: true,
                                intersect: false,
                                y: {
                                    formatter: function (y) {
                                        if (typeof y !== "undefined") {
                                            return y.toFixed(2);
                                        }
                                        return y;
                                    },
                                },
                            },
                            legend: {
                                position: "top",
                            },
                            grid: {
                                borderColor: "#e7e7e7",
                                row: {
                                    colors: ["#f3f3f3", "transparent"],
                                    opacity: 0.5,
                                },
                            },
                            markers: {
                                size: 1,
                            },
                            colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560"],
                        };
                        if (chartTypes) {
                            options.series = options.series.map(function (s, i) { return (__assign(__assign({}, s), { type: chartTypes[i] })); });
                        }
                        var chart = new apexcharts_1.default(document.querySelector(elementId), options);
                        chart.render();
                        return chart;
                    };
                    mainChart = createChart("#chart1", [
                        { name: "Total Value (USDT)", data: totalValues },
                        { name: "Number of Transactions", data: transactionCounts },
                    ], ["Total Value (USDT)", "Number of Transactions"], ["line", "column"], 400);
                    baseFeeChart = createChart("#chart2", [{ name: "Base Fee (Gwei)", data: baseFees }], ["Base Fee (Gwei)"], ["line"], // chartTypes
                    350);
                    gasRatioChart = createChart("#chart3", [{ name: "Gas Used Over Limit (%)", data: gasRatio }], ["Gas Used Over Limit (%)"], ["line"], // chartTypes
                    350);
                    (0, usdt_tx_1.listenForNewTransactions)(function (data) { return __awaiter(_this, void 0, void 0, function () {
                        var newLabel, newTotalValue, newBaseFee;
                        return __generator(this, function (_a) {
                            console.log("New Block Transaction:", data);
                            newLabel = data.block.toString();
                            newTotalValue = parseFloat(alchemy_sdk_1.Utils.formatUnits(data.totalValue, 6));
                            newBaseFee = data.baseFee / 1e9;
                            mainChart.appendData([
                                { data: [newTotalValue] },
                                { data: [data.transactions] },
                            ]);
                            baseFeeChart.appendData([{ data: [newBaseFee] }]);
                            gasRatioChart.appendData([{ data: [data.gasUsedOverLimit] }]);
                            [mainChart, baseFeeChart, gasRatioChart].forEach(function (chart) {
                                chart.updateOptions({
                                    xaxis: {
                                        categories: __spreadArray(__spreadArray([], labels, true), [newLabel], false),
                                    },
                                });
                            });
                            labels.push(newLabel);
                            return [2 /*return*/];
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
})();
