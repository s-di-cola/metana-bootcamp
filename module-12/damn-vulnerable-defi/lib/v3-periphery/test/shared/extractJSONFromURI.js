"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractJSONFromURI = extractJSONFromURI;
function extractJSONFromURI(uri) {
    var encodedJSON = uri.substr('data:application/json;base64,'.length);
    var decodedJSON = Buffer.from(encodedJSON, 'base64').toString('utf8');
    return JSON.parse(decodedJSON);
}
