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
exports.getNetworkStats = void 0;
var test_1 = require("@playwright/test");
var csv_writer_1 = require("csv-writer");
var TWO_MINUTES = 2 * 60 * 1000;
function getNetworkStats() {
    return __awaiter(this, void 0, void 0, function () {
        var browser, page, downloadValue, uploadValue, pingValue, jitterValue, lostValue, csvWriter, records;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, test_1.firefox.launch({ headless: true })];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _a.sent();
                    return [4 /*yield*/, page.goto('https://beta.simet.nic.br/')];
                case 3:
                    _a.sent();
                    // Await measure http call to conclude
                    return [4 /*yield*/, page.waitForResponse('https://api.simet.nic.br/collector/measure', { timeout: TWO_MINUTES })];
                case 4:
                    // Await measure http call to conclude
                    _a.sent();
                    return [4 /*yield*/, getValueFromHTMLElement(page, '.text-md-left > div:nth-child(2) > span:nth-child(2)')];
                case 5:
                    downloadValue = _a.sent();
                    return [4 /*yield*/, getValueFromHTMLElement(page, '.text-md-right > div:nth-child(2) > span:nth-child(2)')];
                case 6:
                    uploadValue = _a.sent();
                    return [4 /*yield*/, getValueWithoutUnitFromHTMLElement(page, 'div.col-md-4:nth-child(1) > div:nth-child(1) > div:nth-child(1) > p:nth-child(2) > span:nth-child(1)', ' ms')];
                case 7:
                    pingValue = _a.sent();
                    return [4 /*yield*/, getValueWithoutUnitFromHTMLElement(page, 'div.col-md-4:nth-child(2) > div:nth-child(1) > div:nth-child(1) > p:nth-child(2) > span:nth-child(1)', ' ms')];
                case 8:
                    jitterValue = _a.sent();
                    return [4 /*yield*/, getValueWithoutUnitFromHTMLElement(page, 'div.col-12:nth-child(3) > div:nth-child(1) > div:nth-child(1) > p:nth-child(2) > span:nth-child(1)', ' %')];
                case 9:
                    lostValue = _a.sent();
                    csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
                        path: 'number.csv',
                        header: [
                            { id: 'download', title: 'Download' },
                            { id: 'upload', title: 'Upload' },
                            { id: 'ping', title: 'Ping' },
                            { id: 'jitter', title: 'Jitter' },
                            { id: 'lost', title: 'Lost' },
                            { id: 'date', title: 'Date' },
                        ],
                        append: true,
                    });
                    records = [
                        {
                            download: downloadValue,
                            upload: uploadValue,
                            ping: pingValue,
                            jitter: jitterValue,
                            lost: lostValue,
                            date: new Date().toISOString(),
                        },
                    ];
                    return [4 /*yield*/, csvWriter.writeRecords(records)];
                case 10:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.getNetworkStats = getNetworkStats;
function getValueFromHTMLElement(page, selector) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var htmlEl, value, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.$(selector)];
                case 1:
                    htmlEl = _c.sent();
                    _b = Number;
                    return [4 /*yield*/, (htmlEl === null || htmlEl === void 0 ? void 0 : htmlEl.textContent())];
                case 2:
                    value = _b.apply(void 0, [(_a = _c.sent()) !== null && _a !== void 0 ? _a : '-1']);
                    ;
                    return [2 /*return*/, value];
            }
        });
    });
}
function getValueWithoutUnitFromHTMLElement(page, selector, unit) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var htmlEl, value, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, page.$(selector)];
                case 1:
                    htmlEl = _d.sent();
                    _c = Number;
                    return [4 /*yield*/, (htmlEl === null || htmlEl === void 0 ? void 0 : htmlEl.textContent())];
                case 2:
                    value = _c.apply(void 0, [(_b = (_a = (_d.sent())) === null || _a === void 0 ? void 0 : _a.replace(unit, '')) !== null && _b !== void 0 ? _b : '-1']);
                    return [2 /*return*/, value];
            }
        });
    });
}
