'use strict';

var util = require('util'),
    regExpUtils = require('../lib/regExpUtils');

module.exports = {
    '__name': { '': function(test) { test.done(); } },
    '__description': { '': function(test) { test.done(); } },
    'escape': {
        'Escape special characters and returns RegExp': function(test) {
            var regExp = regExpUtils.escape('this*is*a[test]');

            test.equal(regExp.toString(), '/this\\*is\\*a\\[test\\]/');
            test.ok(util.isRegExp(regExp));

            test.ok(regExp.test('this*is*a[test]'));
            test.ok(!/this*is*a[test]/.test('this*is*a[test]'));

            test.done();
        }
    }
};