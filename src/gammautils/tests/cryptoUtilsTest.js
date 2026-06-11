'use strict';

var cryptoUtils = require('../lib/cryptoUtils');

module.exports = {
    '__name': { '': function(test) { test.done(); } },
    '__description': { '': function(test) { test.done(); } },
    'hmac': {
        //too random to test
        //
        //It's return value is already in base64
    },

    'toBase64': {
        'Encodes properly': function(test) {
            cryptoUtils.toBase64('Gammasoft', 'R2FtbWFzb2Z0');
            test.done();
        },
    },

    'fromBase64': {
        'Descodes properly': function(test) {
            cryptoUtils.toBase64('R2FtbWFzb2Z0', 'R2FtbWFzb2Z0');
            test.done();
        },
    },

    'sha1': {
        'Check that sha1 is properly calculated': function(test){
            test.ok(cryptoUtils.sha1('gammautils'), '87d70d555f99168adcb987e0ce6a29f4aa7de885');
            test.ok(cryptoUtils.sha1('Gammasoft Desenvolvimento de Software Ltda'), 'ec4748010cca99c353e32dfc1b03baa9625713b6');
            test.done();
        }
    },

    'md5': {
        'Check that md5 is properly calculated': function(test){
            test.ok(cryptoUtils.md5('gammautils'), '5c46d1c40197fdea3fc01dfca60a6b4e');
            test.ok(cryptoUtils.md5('Gammasoft Desenvolvimento de Software Ltda'), 'f2b33e92cdcafc6d8873eb847639b573');
            test.done();
        }
    },

    'cipher': {
        'This function allows you to cipher any text': function(test) {
            var value = 'gammautils',
                password = 'password',
                cipher = cryptoUtils.cipher(value, password);

            test.equal(value, cryptoUtils.decipher(cipher, password));
            test.done();
        },

        'Will produce different ciphers for the same text being encoded': function(test) {
            var value = 'gammautils',
                password = 'password';

            var cipher1 = cryptoUtils.cipher(value, password),
                cipher2 = cryptoUtils.cipher(value, password);

            test.notEqual(cipher1, cipher2);
            test.done();
        }
    },

    'decipher': {
        'This function allows you to decipher any text since you know the key and the algorithm used': function(test) {
            var value = 'gammautils',
                password = 'password',
                cipher = cryptoUtils.cipher(value, password);

            test.equal(value, cryptoUtils.decipher(cipher, password));
            test.done();
        }
    }
};
