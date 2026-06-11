'use strict';

var crypto = require('crypto'),
    stringUtils = require('./stringUtils');

module.exports.__name = 'Crypto';

module.exports.toBase64 = function(string) {
    return new Buffer(string).toString('base64');
};

module.exports.fromBase64 = function(string) {
    return new Buffer(string, 'base64').toString('ascii');
};

module.exports.hmac = function(algorithm, key, text, encoding) {
    if(typeof encoding === 'undefined') {
        encoding = 'base64';
    }

    var hmac = crypto.createHmac(algorithm, key);

    hmac.setEncoding(encoding);
    hmac.write(text);
    hmac.end();

    return hmac.read();
};

module.exports.sha1 = function(value){
    return crypto.createHash('sha1').update(value).digest('hex');
};

module.exports.md5 = function(value){
    return crypto.createHash('md5').update(value).digest('hex');
};

module.exports.cipher = function(value, password, algorithm){
    algorithm = algorithm || 'aes256';

    var iv = stringUtils.generateGuid().replace(/-/g, '');
    var cipher = crypto.createCipher(algorithm, password);
    return cipher.update(iv + value, 'utf8', 'hex') + cipher.final('hex');
};

module.exports.decipher = function(value, password, algorithm){
    algorithm = algorithm || 'aes256';

    var decipher = crypto.createDecipher(algorithm, password);
    var original = decipher.update(value, 'hex', 'utf8') + decipher.final('utf8');

    return original.slice(32);
};
