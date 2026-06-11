'use strict';

var mathUtils = require('../lib/mathUtils');

module.exports = {
    '__name': { '': function(test) { test.done(); } },
    '__description': { '': function(test) { test.done(); } },
    'solve': {
        'Solves simple equations': function(test){
            //Available functions in `Math`
            //Math.E                     Math.LN10                  Math.LN2                   Math.LOG10E                Math.LOG2E                 Math.PI                    Math.SQRT1_2               Math.SQRT2                 Math.abs                   Math.acos                  Math.asin                  Math.atan                  Math.atan2
            //Math.ceil                  Math.cos                   Math.exp                   Math.floor                 Math.log                   Math.max                   Math.min                   Math.pow                   Math.random                Math.round                 Math.sin                   Math.sqrt                  Math.tan

            test.equal(mathUtils.solve('round(test / 2)', { test: 5 }), 3);
            test.equal(mathUtils.solve('floor(test / 2)', { test: 5 }), 2);
            test.equal(mathUtils.solve('2 + 2'), 4);
            test.equal(mathUtils.solve('cos(PI)'), -1);
            test.done();
        }
    }
};