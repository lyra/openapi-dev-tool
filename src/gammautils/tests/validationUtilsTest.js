'use strict';

var validationUtils = require('../lib/validationUtils');

module.exports = {
    '__name': { '': function(test) { test.done(); } },
    '__description': { '': function(test) { test.done(); } },
    'areValidGeoCoordinates': {
        'can pass values as numbers': function(test) {
            test.ok(validationUtils.areValidGeoCoordinates(0, 0));
            test.ok(validationUtils.areValidGeoCoordinates(90, 180));
            test.ok(validationUtils.areValidGeoCoordinates(-90, -180));

            test.done();
        },

        'can pass values as strings': function(test) {
            test.ok(validationUtils.areValidGeoCoordinates('0', '0'));
            test.ok(validationUtils.areValidGeoCoordinates('90', '180'));
            test.ok(validationUtils.areValidGeoCoordinates('-90', '-180'));

            test.done();
        },

        'can pass values as objects': function(test) {
            test.ok(validationUtils.areValidGeoCoordinates({latitude: 0, longitude: 0 }));
            test.ok(validationUtils.areValidGeoCoordinates({latitude: 45, longitude: 45 }));
            test.ok(validationUtils.areValidGeoCoordinates({latitude: 90, longitude: -90 }));

            test.ok(validationUtils.areValidGeoCoordinates({lat: 0, lng: 0 }));
            test.ok(validationUtils.areValidGeoCoordinates({lat: 45, lng: 45 }));
            test.ok(validationUtils.areValidGeoCoordinates({lat: 90, lng: -90 }));

            test.done();
        },

        'can pass values as strings within an object': function(test) {
            test.ok(validationUtils.areValidGeoCoordinates({latitude: '0', longitude: '0' }));
            test.ok(validationUtils.areValidGeoCoordinates({latitude: '45', longitude: '45' }));
            test.ok(validationUtils.areValidGeoCoordinates({latitude: '90', longitude: '-90' }));

            test.done();
        },
    },
    'isValidLatitude': {
        'is valid if latitude is between -90 and 90': function(test) {
            test.ok(validationUtils.isValidLatitude(0));
            test.ok(validationUtils.isValidLatitude(-90));
            test.ok(validationUtils.isValidLatitude(90));
            test.ok(validationUtils.isValidLatitude(-45));
            test.ok(validationUtils.isValidLatitude(45));

            test.done();
        },

        'is not valid if latitude is lesser than -90 or greater than 90': function(test) {
            test.ok(!validationUtils.isValidLatitude(-91));
            test.ok(!validationUtils.isValidLatitude(-100));
            test.ok(!validationUtils.isValidLatitude(-180));

            test.ok(!validationUtils.isValidLatitude(91));
            test.ok(!validationUtils.isValidLatitude(100));
            test.ok(!validationUtils.isValidLatitude(180));

            test.done();
        },

        'can pass values in a string': function(test) {
            test.ok(!validationUtils.isValidLatitude('-91'));
            test.ok(validationUtils.isValidLatitude('90'));
            test.done();
        },

        'fails when parameters are not numeric': function(test) {
            test.ok(!validationUtils.isValidLatitude('test will fail'));
            test.ok(!validationUtils.isValidLatitude(new Date()));
            test.ok(!validationUtils.isValidLatitude(/regex/));

            test.done();
        },
    },
    'isValidLongitude': {
        'is valid if longitude is between -180 and 180': function(test) {
            test.ok(validationUtils.isValidLongitude(0));
            test.ok(validationUtils.isValidLongitude(-180));
            test.ok(validationUtils.isValidLongitude(180));
            test.ok(validationUtils.isValidLongitude(-90));
            test.ok(validationUtils.isValidLongitude(90));

            test.done();
        },

        'is not valid if longitude is lesser than -180 or greater than 180': function(test) {
            test.ok(!validationUtils.isValidLongitude(-180.23));
            test.ok(!validationUtils.isValidLongitude(-200));
            test.ok(!validationUtils.isValidLongitude(-320));

            test.ok(!validationUtils.isValidLongitude(180.23));
            test.ok(!validationUtils.isValidLongitude(200));
            test.ok(!validationUtils.isValidLongitude(320));

            test.done();
        },

        'can pass values in a string': function(test) {
            test.ok(!validationUtils.isValidLongitude('-181'));
            test.ok(validationUtils.isValidLongitude('180'));
            test.done();
        },

        'fails when parameters are not numeric': function(test) {
            test.ok(!validationUtils.isValidLongitude('test will fail'));
            test.ok(!validationUtils.isValidLongitude(new Date()));
            test.ok(!validationUtils.isValidLongitude(/regex/));

            test.done();
        },
    },
    'validFormattedEmailAddressRegExp': {
        'Check that RegExp matches major cases': function(test) {
            var regExp = validationUtils.validFormattedEmailAddressRegExp;

            var data = 'Fulano de Tal <fulano_de_tal@example.com>'.match(regExp);

            test.notEqual(data, null);
            test.equal(data[1], 'Fulano de Tal');
            test.equal(data[2], 'fulano_de_tal@example.com');

            test.done();
        }
    },

    'validEmailRegExpForJade': {
        'Check that validEmailRegExpForJade is the same as validEmailRegExp': function(test) {
            test.equal(new RegExp(validationUtils.validEmailRegExpForJade).toString(), validationUtils.validEmailRegExp.toString());
            test.done();
        }
    },

    'validEmailRegExp': {
        //tested by isValidEmail tests above
    },

    'isValidEmail': {
        'Check that valid emails are valid': function(test) {
            test.ok(validationUtils.isValidEmail('renatoargh@gmail.com'));
            test.ok(validationUtils.isValidEmail('contact@gammasoft.com.br'));
            test.ok(validationUtils.isValidEmail('fulano_de_tal@gmail.com'));
            test.ok(validationUtils.isValidEmail('renato@prv.ind.br'));

            test.done();
        },

        'Check that invalid emails are invalid': function(test) {
            test.ok(!validationUtils.isValidEmail('this is not an email'));
            test.ok(!validationUtils.isValidEmail('neither@this'));
            test.ok(!validationUtils.isValidEmail('not_an_email@gmail com'));
            test.ok(!validationUtils.isValidEmail('one-more%@gmail.com'));

            test.done();
        }
    },

    'isNumericString': {
        'Contains only numbers': function(test){
            test.ok(validationUtils.isNumericString('0123'));
            test.ok(validationUtils.isNumericString('134135'));
            test.ok(validationUtils.isNumericString('0000001223'));
            test.ok(!validationUtils.isNumericString('012x3'));
            test.ok(!validationUtils.isNumericString('afds12'));
            test.ok(!validationUtils.isNumericString('0000001223_!'));

            test.done();
        }
    }
};