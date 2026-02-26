'use strict';

var booleanUtils = require('../lib/booleanUtils');

module.exports = {
    '__name': { '': function(test) { test.done(); } },
    '__description': { '': function(test) { test.done(); } },
    'isTrue': {
        'Check if return expected results': function(test) {
            test.ok(booleanUtils.isTrue('true'));
            test.ok(booleanUtils.isTrue('yes'));
            test.ok(booleanUtils.isTrue('on'));
            test.ok(booleanUtils.isTrue(true));
            test.ok(booleanUtils.isTrue(1));

            test.ok(!booleanUtils.isTrue('false'));
            test.ok(!booleanUtils.isTrue(false));
            test.ok(!booleanUtils.isTrue(0));

            test.ok(!booleanUtils.isTrue(undefined));
            test.ok(!booleanUtils.isTrue(null));

            test.done();
        }
    }
};