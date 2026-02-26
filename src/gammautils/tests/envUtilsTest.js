'use strict';

var rewire = require('rewire'),
    envUtils = rewire('../lib/envUtils');

module.exports = {
    '__name': { '': function(test) { test.done(); } },
    '__description': { '': function(test) { test.done(); } },
    'is': {
        'detects proper environments': function(test) {
            envUtils.__set__('NODE_ENV', 'development');
            test.ok(envUtils.is('development'));

            envUtils.__set__('NODE_ENV', undefined);
            test.ok(envUtils.is('development'));

            envUtils.__set__('NODE_ENV', 'test');
            test.ok(envUtils.is('test'));

            envUtils.__set__('NODE_ENV', 'production');
            test.ok(envUtils.is('production'));

            test.done();
        }
    },

    'ifEnvIs': {
        'will execute conditionals': function(test) {

            envUtils.__set__('NODE_ENV', 'development');

            envUtils.ifEnvIs('development').then(function() {
                test.ok(true);
            });

            envUtils.ifEnvIs('production').otherwise(function() {
                test.ok(true);
            });

            test.expect(2);
            test.done();
        },

        'can check multiple environments': function(test) {

            envUtils.__set__('NODE_ENV', 'development');
            envUtils.ifEnvIs('development').or('testing').then(function() {
                test.ok(true);
            });

            envUtils.__set__('NODE_ENV', 'testing');
            envUtils.ifEnvIs('development').or('testing').then(function() {
                test.ok(true);
            });

            envUtils.__set__('NODE_ENV', 'production');
            envUtils.ifEnvIs('development').or('testing').otherwise(function() {
                test.ok(true);
            });

            test.expect(3);
            test.done();
        },
    }
};