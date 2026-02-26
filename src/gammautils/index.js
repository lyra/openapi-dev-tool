//browserify index.js -s gammautils | uglifyjs > gammautils.min.js

'use strict';

module.exports = {
    array: require('./lib/arrayUtils'),
    console: require('./lib/consoleUtils'),
    crypto: require('./lib/cryptoUtils'),
    controller: require('./lib/controllerUtils'),
    date: require('./lib/dateUtils'),
    error: require('./lib/errorUtils'),
    env: require('./lib/envUtils'),
    timezone: require('./lib/timezoneUtils'),
    fs: require('./lib/fsUtils'),
    math: require('./lib/mathUtils'),
    number: require('./lib/numberUtils'),
    object: require('./lib/objectUtils'),
    string: require('./lib/stringUtils'),
    http: require('./lib/httpUtils'),
    boolean: require('./lib/booleanUtils'),
    recomendation: require('./lib/recomendationUtils'),
    url: require('./lib/urlUtils'),
    validation: require('./lib/validationUtils'),
    barcode: require('./lib/barcodeUtils'),
    regExp: require('./lib/regExpUtils'),
};