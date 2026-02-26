'use strict';

var path = require('path');

module.exports.__name = 'Barcode';
module.exports.__description = 'Utilities for generating barcodes';

function code25IEncoding(string) {
    if(string.length % 2 !== 0) {
        throw new Error('Text must have an even number of characters');
    }

    var start = String.fromCharCode(201),
        stop = String.fromCharCode(202);

    return string.match(/.{2}/g).map(Number).reduce(function(acc, value){
        if(value >= 0 && value <= 93) {
            return acc + String.fromCharCode(value + 33);
        }

        if(value >= 94 && value <= 99) {
            return acc + String.fromCharCode(value + 101);
        }

        throw new Error('Values should range from 0 to 99');
    }, start) + stop;
}

function code128Encoding(string) {
    //TODO: This function encodes only code128C
    if(string.length % 2 !== 0) {
        throw new Error('Text must have an even number of characters');
    }

    function getAscii(value) {
        if(value >= 0 && value <= 94) {
            return String.fromCharCode(value + 32);
        }

        if(value >= 95 && value <= 102) {
            return String.fromCharCode(value + 105);
        }

        throw new Error('Values should range from 0 to 99');
    }

    var checkDigit = 105,
        start = String.fromCharCode(210),
        stop = String.fromCharCode(211);

    return string.match(/.{2}/g).map(Number).reduce(function(acc, value, index){
        checkDigit += value * (index + 1);
        return acc + getAscii(value);
    }, start) + getAscii(checkDigit % 103) + stop;
}

module.exports.code128 = {
    font: path.join(__dirname, './fonts', 'code128.ttf'),
    encode: code128Encoding
};

module.exports.code25I = {
    font: path.join(__dirname, './fonts', 'code25I.ttf'),
    encode: code25IEncoding
};

module.exports.barcode128c = function() {
    throw new Error('Deprecated - use `utils.barcode.code128` instead');
};
