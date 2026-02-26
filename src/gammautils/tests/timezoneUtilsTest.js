'use strict';

var timezoneUtils = require('../lib/timezoneUtils');

module.exports = {
    '__name': { '': function(test) { test.done(); } },
    '__description': { '': function(test) { test.done(); } },
    africa: {
        'Is array and has correct amount of timezones': function(test) {
            test.ok(Array.isArray(timezoneUtils.africa));
            test.equal(timezoneUtils.africa.length, 52);
            test.done();
        }
    },
    america: {
        'Is array and has correct amount of timezones': function(test) {
            test.ok(Array.isArray(timezoneUtils.america));
            test.equal(timezoneUtils.america.length, 148);
            test.done();
        }
    },
    antarctica: {
        'Is array and has correct amount of timezones': function(test) {
            test.ok(Array.isArray(timezoneUtils.antarctica));
            test.equal(timezoneUtils.antarctica.length, 11);
            test.done();
        }
    },
    artic: {
        'Is array and has correct amount of timezones': function(test) {
            test.ok(Array.isArray(timezoneUtils.artic));
            test.equal(timezoneUtils.artic.length, 1);
            test.done();
        }
    },
    asia: {
        'Is array and has correct amount of timezones': function(test) {
            test.ok(Array.isArray(timezoneUtils.asia));
            test.equal(timezoneUtils.asia.length, 79);
            test.done();
        }
    },
    atlantic: {
        'Is array and has correct amount of timezones': function(test) {
            test.ok(Array.isArray(timezoneUtils.atlantic));
            test.equal(timezoneUtils.atlantic.length, 10);
            test.done();
        }
    },
    australia: {
        'Is array and has correct amount of timezones': function(test) {
            test.ok(Array.isArray(timezoneUtils.australia));
            test.equal(timezoneUtils.australia.length, 12);
            test.done();
        }
    },
    europe: {
        'Is array and has correct amount of timezones': function(test) {
            test.ok(Array.isArray(timezoneUtils.europe));
            test.equal(timezoneUtils.europe.length, 56);
            test.done();
        }
    },
    generic: {
        'Is array and has correct amount of timezones': function(test) {
            test.ok(Array.isArray(timezoneUtils.generic));
            test.equal(timezoneUtils.generic.length, 11);
            test.done();
        }
    },
    indian: {
        'Is array and has correct amount of timezones': function(test) {
            test.ok(Array.isArray(timezoneUtils.indian));
            test.equal(timezoneUtils.indian.length, 11);
            test.done();
        }
    },
    pacific: {
        'Is array and has correct amount of timezones': function(test) {

            test.ok(Array.isArray(timezoneUtils.pacific));
            test.equal(timezoneUtils.pacific.length, 38);

            test.done();
        }
    },
    all: {
        'Is object and has all timezones defined': function(test) {
            var allTimezones = timezoneUtils.all;

            test.ok(typeof allTimezones.africa === 'object');
            test.ok(typeof allTimezones.america === 'object');
            test.ok(typeof allTimezones.antarctica === 'object');
            test.ok(typeof allTimezones.artic === 'object');
            test.ok(typeof allTimezones.asia === 'object');
            test.ok(typeof allTimezones.atlantic === 'object');
            test.ok(typeof allTimezones.australia === 'object');
            test.ok(typeof allTimezones.europe === 'object');
            test.ok(typeof allTimezones.generic === 'object');
            test.ok(typeof allTimezones.indian === 'object');
            test.ok(typeof allTimezones.pacific === 'object');

            test.done();
        }
    }
};