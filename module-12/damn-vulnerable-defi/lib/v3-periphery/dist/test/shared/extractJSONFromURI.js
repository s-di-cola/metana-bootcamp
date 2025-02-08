"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractJSONFromURI = void 0;
function extractJSONFromURI(uri) {
    const encodedJSON = uri.substr('data:application/json;base64,'.length);
    const decodedJSON = Buffer.from(encodedJSON, 'base64').toString('utf8');
    return JSON.parse(decodedJSON);
}
exports.extractJSONFromURI = extractJSONFromURI;
