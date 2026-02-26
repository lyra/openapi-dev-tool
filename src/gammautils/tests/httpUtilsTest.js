'use strict';

var httpUtils = require('../lib/httpUtils');

module.exports = {
    '__name': { '': function(test) { test.done(); } },
    '__description': { '': function(test) { test.done(); } },
    'methods': {
        'Check that correct amount of methods are available': function(test) {
            test.equals(httpUtils.methods.length, 24);
            test.done();
        }
    },

    'statuses': {
        'Check that correct number of statuses are available': function(test) {
            test.equals(Object.keys(httpUtils.statuses).length / 2, 42);

            test.done();
        }
    }
};