var numberUtils = require('../lib/numberUtils');

with(numberUtils) {
    module.exports = {
        '__name': { '': function(test) { test.done(); } },
        '__description': { '': function(test) { test.done(); } },
        'getRandomInteger': {
            'Check that number is between given range': function(test){
                var random = getRandomInteger(0, 10);

                test.ok(random >= 0);
                test.ok(random <= 10);
                test.done();
            },

            'Check that number range is inclusive': function(test){
                var random = getRandomInteger(0, 1);

                test.ok(random === 0 || random === 1);
                test.done();
            }
        },

        'isBetween': {
            'Check that verification is inclusive by default': function(test){
                test.ok(isBetween(1, 1, 2));
                test.ok(isBetween(2.234, 1, 2.234));
                test.done();
            },

            'Check when inclusive is false': function(test){
                test.equal(isBetween(1, 1, 2, false), false);
                test.equal(isBetween(2.234, 1, 2.234, false), false);
                test.done();
            },

            'Check that it works as expected': function(test){
                test.ok(isBetween(0, -5, 5));
                test.ok(isBetween(100, 0, 200));
                test.ok(isBetween(500, 250, 1000));
                test.done();
            }
        },

        'decimalPlaces': {
            'Check that function returns the right amount of decimal places': function(test) {
                test.equal(decimalPlaces(1), 0);
                test.equal(decimalPlaces(2.1), 1);
                test.equal(decimalPlaces(3.01), 2);
                test.equal(decimalPlaces(3.010), 2);
                test.equal(decimalPlaces(3.014), 3);
                test.equal(decimalPlaces(2e-3), 3);
                test.equal(decimalPlaces(2e-5), 5);
                test.done();
            },
        }
    };
}
