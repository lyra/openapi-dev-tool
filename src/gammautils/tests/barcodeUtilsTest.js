'use strict';

var fs = require('fs'),
    barcodeUtils = require('../lib/barcodeUtils');

module.exports = {
    '__name': { '': function(test) { test.done(); } },
    '__description': { '': function(test) { test.done(); } },

    code128: {
        'Font file exists': function(test) {
            test.ok(fs.existsSync(barcodeUtils.code128.font));
            test.done();
        },

        'Encodes properly': function(test) {
            test.throws(function(){
                barcodeUtils.code128.encode('123');
            });

            test.throws(function(){
                barcodeUtils.code128.encode('123s');
            });

            var barcode1 = barcodeUtils.code128.encode('123456');
            test.equal(barcode1, 'Ò,BXLÓ');

            var barcode2 = barcodeUtils.code128.encode('012345678912');
            test.equal(barcode2, 'Ò!7Mcy,JÓ');

            var barcode3 = barcodeUtils.code128.encode('52060433009911002506550120000007800267301615');
            test.equal(barcode3, 'ÒT&$A Ì+ 9&W!4  \'p"c>0/-Ó');

            var barcode4 = barcodeUtils.code128.encode('53150219950366000150550010000000051198698992');
            test.equal(barcode4, 'ÒU/"3È#b !RW *   %+Ëey|ÏÓ');

            test.done();
        },
    },

    code25I: {
        'Font file exists': function(test) {
            test.ok(fs.existsSync(barcodeUtils.code25I.font));
            test.done();
        },//É\'Ê

        'Encodes properly': function(test) {
            test.throws(function(){
                barcodeUtils.code25I.encode('123');
            });

            test.throws(function(){
                barcodeUtils.code25I.encode('123s');
            });

            var barcode1 = barcodeUtils.code25I.encode('123456');
            test.equal(barcode1, 'É-CYÊ');

            var barcode2 = barcodeUtils.code25I.encode('012345678912');
            test.equal(barcode2, 'É"8Ndz-Ê');

            var barcode3 = barcodeUtils.code25I.encode('06');
            test.equal(barcode3, 'É\'Ê');

            // var barcode3 = barcodeUtils.code25I.encode('52060433009911002506550120000007800267301615');
            // test.equal(barcode3, 'ÒT&$A Ì+ 9&W!4  \'p"c>0/-Ó');

            test.done();
        },
    },

    'barcode128c': function(test){
        test.throws(function() {
            barcodeUtils.barcode128c();
        });

        test.done();
    }
};
