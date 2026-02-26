'use strict';

var oUtils = require('./objectUtils');

module.exports.__name = 'Number';

module.exports.getRandomInteger = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.isBetween = function(value, min, max, inclusive){
    if(oUtils.isUndefined(inclusive)) {
        inclusive = true;
    }

    if(inclusive) {
        return (value >= min && value <= max);
    } else {
        return (value > min && value < max);
    }
};

module.exports.decimalPlaces = function(number) {
    // TAKEN FROM:
    // http://stackoverflow.com/questions/10454518/javascript-how-to-retrieve-the-number-of-decimals-of-a-string-number

    var match = ('' + number).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);

    if (!match) {
        return 0;
    }

    return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? + match[2] : 0));
};
