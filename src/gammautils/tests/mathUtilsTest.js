'use strict';

var util = require('util'),
    mathUtils = require('../lib/mathUtils');

module.exports = {
    '__name': { '': function(test) { test.done(); } },
    '__description': { '': function(test) { test.done(); } },
    'smaller': function(test) {
        test.equal(mathUtils.smaller(1, 3), 1);
        test.equal(mathUtils.smaller(10, 200), 10);
        test.equal(mathUtils.smaller(10, -10), -10);

        test.done();
    },

    'bigger': function(test) {
        test.equal(mathUtils.bigger(1, 3), 3);
        test.equal(mathUtils.bigger(10, 200), 200);
        test.equal(mathUtils.bigger(10, -10), 10);

        test.done();
    },
    'sum': {
        //Intended to be used with [].reduce
        'Can sum properly': function(test) {
            test.equal(2, mathUtils.sum(1, 1));
            test.done();
        }
    },
    'subtract': {
        //Intended to be used with [].reduce
        'Can subtract properly': function(test) {
            test.equal(0, mathUtils.subtract(1, 1));
            test.done();
        }
    },
    'Maximum': {
        'Tests basic functionality': function(test) {
            var maximum = new mathUtils.Maximum();

            maximum.compare(5);
            maximum.compare(2);
            maximum.compare(9);
            maximum.compare(1);
            maximum.compare(7);

            test.equal(maximum.current, 9);
            test.done();
        },

        'Can get values from strings': function(test) {
            var maximum = new mathUtils.Maximum();

            maximum.compare('7');
            maximum.compare('200');
            maximum.compare('190');

            test.equal(maximum.current, 200);
            test.done();
        }
    },
    'Minimum': {
        'Tests basic functionality': function(test) {
            var minimum = new mathUtils.Minimum();

            minimum.compare(5);
            minimum.compare(2);
            minimum.compare(9);
            minimum.compare(1);
            minimum.compare(7);

            test.equal(minimum.current, 1);
            test.done();
        },

        'Can get values from strings': function(test) {
            var minimum = new mathUtils.Minimum();

            minimum.compare('7');
            minimum.compare('200');
            minimum.compare('190');

            test.equal(minimum.current, 7);
            test.done();
        }
    },
    'MovingAverage': {
        'Return expected values': function(test) {
            var movingAverage = new mathUtils.MovingAverage(3);

            test.equal(movingAverage.add(1), undefined);
            test.equal(movingAverage.add(2), undefined);
            test.equal(movingAverage.add(3), 2);
            test.equal(movingAverage.add(4), 3);
            test.equal(movingAverage.add(5), 4);
            test.equal(movingAverage.add(6), 5);
            test.equal(movingAverage.add(7), 6);

            test.done();
        },

        'Can fill values': function(test) {
            var movingAverage = new mathUtils.MovingAverage(3, true);

            test.equal(movingAverage.add(1), 1);
            test.equal(movingAverage.add(2), 1.5);
            test.equal(movingAverage.add(3), 2);
            test.equal(movingAverage.add(4), 3);
            test.equal(movingAverage.add(5), 4);
            test.equal(movingAverage.add(6), 5);
            test.equal(movingAverage.add(7), 6);

            test.done();
        },

        'Can obtain values from strings': function(test) {
            var movingAverage = new mathUtils.MovingAverage(3, true);

            test.equal(movingAverage.add('1'), 1);
            test.equal(movingAverage.add('2'), 1.5);
            test.equal(movingAverage.add('3'), 2);
            test.equal(movingAverage.add('4'), 3);
            test.equal(movingAverage.add('5'), 4);
            test.equal(movingAverage.add('6'), 5);
            test.equal(movingAverage.add('7'), 6);

            test.done();
        },

        'Can apply weights': function(test) {
            //the same as [1, 2, 3]
            var movingAverage = new mathUtils.MovingAverage(3, false, true);

            test.equal(movingAverage.add(1), undefined);
            test.equal(movingAverage.add(2), undefined);
            test.equal(movingAverage.add(3).toFixed(2), '2.33');
            test.equal(movingAverage.add(4).toFixed(2), '3.33');
            test.equal(movingAverage.add(5).toFixed(2), '4.33');

            test.done();
        },

        'Can fill with applied weights': function(test) {
            //the same as [1, 2, 3]
            var movingAverage = new mathUtils.MovingAverage(3, true, true);

            test.equal(movingAverage.add(1), 1);
            test.equal(movingAverage.add(2).toFixed(2), '1.67');
            test.equal(movingAverage.add(3).toFixed(2), '2.33');
            test.equal(movingAverage.add(4).toFixed(2), '3.33');
            test.equal(movingAverage.add(5).toFixed(2), '4.33');

            test.done();
        },

        'Can pass specific weights': function(test) {
            var movingAverage = new mathUtils.MovingAverage(5, false, [1, 1, 2, 2, 3]);

            test.equal(movingAverage.add(1), undefined);
            test.equal(movingAverage.add(2), undefined);
            test.equal(movingAverage.add(3), undefined);
            test.equal(movingAverage.add(4), undefined);
            test.equal(movingAverage.add(5).toFixed(2), '3.56');
            test.equal(movingAverage.add(6).toFixed(2), '4.56');

            test.done();
        },

        'Can fill when passing specific weights': function(test) {
            var movingAverage = new mathUtils.MovingAverage(5, true, [1, 1, 2, 2, 3]);

            test.equal(movingAverage.add(1), 1);
            test.equal(movingAverage.add(2), 1.5);
            test.equal(movingAverage.add(3), 2.25);
            test.equal(movingAverage.add(4).toFixed(2), '2.83');
            test.equal(movingAverage.add(5).toFixed(2), '3.56');
            test.equal(movingAverage.add(6).toFixed(2), '4.56');

            test.done();
        },

        'If passing weights then weight array must have same length as samples to count': function(test) {
            var movingAverage = new mathUtils.MovingAverage(5, true, [1, 1, 2, 2]);

            test.ok(util.isError(movingAverage));

            test.done();
        },
    },

    'Average': {
        'Return expected results and increases length properly': function(test) {
            var average = new mathUtils.Average();

            test.equal(average.length, 0);
            average.add(1);
            test.equal(average.length, 1);
            average.add(2);
            test.equal(average.length, 2);

            test.equal(average.result, 1.5);
            test.done();
        },

        'Can obtain value from any property and can convert from string': function(test) {
            var average = new mathUtils.Average('value');

            average.add({ value: 10 });
            average.add({ value: '10' });

            test.equal(average.result, 10);
            test.done();
        }
    },

    'LinearRegression': {
        'Adding data increments length proplerly': function(test) {
            var linearRegression = new mathUtils.LinearRegression();

            linearRegression.add({ x: 30, y: 430 });
            test.equal(linearRegression.length, 1);

            linearRegression.add({ x: 21, y: 335 });
            test.equal(linearRegression.length, 2);

            linearRegression.add({ x: 35, y: 520 });
            test.equal(linearRegression.length, 3);

            test.done();
        },

        'Tests main functionality': function(test) {
            var linearRegression = new mathUtils.LinearRegression();

            linearRegression.add({ x: 30, y: 430 });
            linearRegression.add({ x: 21, y: 335 });
            linearRegression.add({ x: 35, y: 520 });
            linearRegression.add({ x: 42, y: 490 });
            linearRegression.add({ x: 37, y: 470 });
            linearRegression.add({ x: 20, y: 210 });
            linearRegression.add({ x: 8, y: 195 });
            linearRegression.add({ x: 17, y: 270 });
            linearRegression.add({ x: 35, y: 400 });
            linearRegression.add({ x: 25, y: 480});

            test.equal(linearRegression.a().toFixed(2), '117.07');
            test.equal(linearRegression.b().toFixed(2), '9.74');

            test.done();
        },

        'Testing ability to obtain values from any other property and with number conversion': function(test) {
            var linearRegression = new mathUtils.LinearRegression('time', 'value');

            linearRegression.add({ time: 30, value: 430 });
            linearRegression.add({ time: 21, value: 335 });
            linearRegression.add({ time: 35, value: 520 });
            linearRegression.add({ time: 42, value: '490' });
            linearRegression.add({ time: 37, value: 470 });
            linearRegression.add({ time: 20, value: 210 });
            linearRegression.add({ time: 8, value: 195 });
            linearRegression.add({ time: 17, value: '270' });
            linearRegression.add({ time: 35, value: 400 });
            linearRegression.add({ time: 25, value: '480' });

            test.equal(linearRegression.a().toFixed(2), '117.07');
            test.equal(linearRegression.b().toFixed(2), '9.74');

            test.done();
        },

        'Tests ability of getting next value, and that correlation is properly calculated': function(test) {
            var linearRegression = new mathUtils.LinearRegression('time', 'value');

            linearRegression.add({ time: 1, value: 1 });
            linearRegression.add({ time: 2, value: 2 });
            linearRegression.add({ time: 3, value: 3 });
            linearRegression.add({ time: 4, value: 4 });
            linearRegression.add({ time: 5, value: 5 });

            test.equal(linearRegression.correlation().toFixed(0), '1');

            test.deepEqual(linearRegression.next(), { x: 6, y: 6 });
            test.deepEqual(linearRegression.next(), { x: 7, y: 7 });
            test.deepEqual(linearRegression.next(), { x: 8, y: 8 });
            test.deepEqual(linearRegression.next(), { x: 9, y: 9 });
            test.deepEqual(linearRegression.next(), { x: 10, y: 10 });

            test.done();
        },

        'Testing correlation': function(test) {
            var linearRegression = new mathUtils.LinearRegression('time', 'value');

            linearRegression.add({ time: 1, value: 5 });
            linearRegression.add({ time: 2, value: 4 });
            linearRegression.add({ time: 3, value: 3 });
            linearRegression.add({ time: 4, value: 2 });
            linearRegression.add({ time: 5, value: 1 });

            test.equal(linearRegression.correlation().toFixed(0), '-1');

            test.done();
        },

        'Should return error if trying to use next but samples was not provided in ascending order of X': function(test) {
            var linearRegression = new mathUtils.LinearRegression('time', 'value');

            linearRegression.add({ time: 3, value: 3 });
            linearRegression.add({ time: 1, value: 1 });
            linearRegression.add({ time: 4, value: 4 });

            test.ok(util.isError(linearRegression.next()));

            test.done();
        }
    },

    'linearRegression': {
        'Return expected results': function(test) {
            var data = [{ x: 30, y: 430 },
                        { x: 21, y: 335 },
                        { x: 35, y: 520 },
                        { x: 42, y: 490 },
                        { x: 37, y: 470 },
                        { x: 20, y: 210 },
                        { x: 8, y: 195 },
                        { x: 17, y: 270 },
                        { x: 35, y: 400 },
                        { x: 25, y: 480}];

            var linearRegression = mathUtils.linearRegression(data);

            test.equal(linearRegression.a.toFixed(2), '117.07');
            test.equal(linearRegression.b.toFixed(2), '9.74');

            test.equal(linearRegression.fn(30).toFixed(2), '409.21');
            test.equal(linearRegression.fn(21).toFixed(2), '321.57');
            test.equal(linearRegression.fn(35).toFixed(2), '457.91');
            test.equal(linearRegression.fn(42).toFixed(2), '526.07');
            test.equal(linearRegression.fn(37).toFixed(2), '477.38');
            test.equal(linearRegression.fn(20).toFixed(2), '311.83');
            test.equal(linearRegression.fn(8).toFixed(2), '194.98');
            test.equal(linearRegression.fn(17).toFixed(2), '282.62');
            test.equal(linearRegression.fn(35).toFixed(2), '457.91');
            test.equal(linearRegression.fn(25).toFixed(2), '360.52');

            test.done();
        }
    },

    'isPrime': {
        'Indentifies first primes': function(test) {
            test.ok(mathUtils.isPrime(2));
            test.ok(mathUtils.isPrime(3));
            test.ok(mathUtils.isPrime(5));
            test.ok(mathUtils.isPrime(7));
            test.ok(mathUtils.isPrime(11));
            test.ok(mathUtils.isPrime(13));
            test.ok(mathUtils.isPrime(17));
            test.ok(mathUtils.isPrime(19));
            test.ok(mathUtils.isPrime(23));
            test.ok(mathUtils.isPrime(29));
            test.ok(mathUtils.isPrime(31));
            test.ok(mathUtils.isPrime(41));
            test.ok(mathUtils.isPrime(43));
            test.ok(mathUtils.isPrime(47));

            test.done();
        }
    },

    'getPrimeFactors': {
        'Get right results for some known cases': function(test) {
            test.deepEqual(mathUtils.getPrimeFactors(4), [2, 2]);
            test.deepEqual(mathUtils.getPrimeFactors(6), [2, 3]);
            test.deepEqual(mathUtils.getPrimeFactors(8), [2, 2, 2]);
            test.deepEqual(mathUtils.getPrimeFactors(9), [3, 3]);
            test.deepEqual(mathUtils.getPrimeFactors(10), [2, 5]);
            //test.deepEqual(mathUtils.getPrimeFactors(472342734872390487), [3, 7, 827, 978491, 27795571]);

            test.done();
        }
    },

    'bigSum': {
        'Can perform trivial sumations': function(test) {
            test.equal(mathUtils.bigSum(2, 3), '5');
            test.equal(mathUtils.bigSum(3, 8), '11');
            test.equal(mathUtils.bigSum(800, 800), '1600');
            test.equal(mathUtils.bigSum(2347, 2785679), '2788026');
            test.equal(mathUtils.bigSum(23472347, 27856792785679), '27856816258026');
            test.equal(mathUtils.bigSum('2347234723472347', '2785679278567927856792785679'), '2785679278570275091516258026');
            test.equal(mathUtils.bigSum('23472347234723472347234723472347', '27856792785679278567927856792785679278567927856792785679'), '27856792785679278567927880265132914002040275091516258026');

            test.done();
        }
    },

    'median': {
        'Check that median is correctly calculated': function(test){
            test.equal(mathUtils.median([5, 10]), 7.5);
            test.equal(mathUtils.median([5, 5]), 5);
            test.equal(mathUtils.median([10, 20, 30]), 20);

            test.done();
        }
    },

    'pearsonCoefficient': {
        'Calculate pearson coefficient properly': function(test){

            test.equal(mathUtils.pearsonCoefficient({
                age: 43,
                glucose: 99
            }, {
                age: 21,
                glucose: 65
            }), 1);

            test.done();
        }
    },

    'euclideanDistance': {
        'Check that calculation can be done with "n" domensions and that they yield right result': function(test){
            test.equal(mathUtils.euclideanDistance({x: 5, y: 4}, {x: 4, y: 1}), 3.1622776601683795);
            test.equal(mathUtils.euclideanDistance({'x axis': 2, 'y axis': 5}, {'x axis': 3, 'y axis': 4}), 1.4142135623730951);
            test.equal(mathUtils.euclideanDistance({i: 2, j: 4, w: 5}, {i: 3, j: 3, w: 3}), 2.449489742783178);
            test.equal(mathUtils.euclideanDistance({a: 10}, {a: 8}), 2);
            test.equal(mathUtils.euclideanDistance({a: 8}, {a: 10}), 2);
            test.equal(mathUtils.euclideanDistance({a: 8, b: 10}, {a: 10}), 2);
            test.equal(mathUtils.euclideanDistance({a: 8}, {a: 10, b: 10}), 2);
            test.equal(mathUtils.euclideanDistance({}, {}), 0);
            test.equal(mathUtils.euclideanDistance(null, null), 0);
            test.equal(mathUtils.euclideanDistance({a: 8}, null), 0);

            test.done();
        }
    },

    'mod': {
        'Check that it calculates the right values': function(test){
            test.equal(mathUtils.mod('036532', [2, 3, 4, 5, 6, 7]), 4);
            test.equal(mathUtils.mod('347389', [2, 3, 4, 5, 6, 7]), 2);
            test.done();
        },

        'Can start from the left side (index 0)': function(test){
            test.equal(mathUtils.mod('036532', [2, 3, 4, 5, 6, 7], 11, 'leftToRight'), 2);
            test.equal(mathUtils.mod('347389', [2, 3, 4, 5, 6, 7], 11, 'leftToRight'), 7);
            test.done();
        },

        'You can pass parameters as a hash': function(test) {
            test.equal(mathUtils.mod({
                value: '036532',
                factors: [2, 3, 4, 5, 6, 7]
            }), 4);

            test.equal(mathUtils.mod({
                value: '347389',
                factors: [2, 3, 4, 5, 6, 7]
            }), 2);

            test.equal(mathUtils.mod({
                value: '036532',
                factors: [2, 3, 4, 5, 6, 7],
                divider: 11,
                direction: 'leftToRight'
            }), 2);

            test.done();
        },

        'You can return the cumplimentary value to the divider': function(test) {
            test.equal(mathUtils.mod({
                value: '036532',
                factors: [2, 3, 4, 5, 6, 7],
                divider: 11,
                cumplimentaryToDivider: true
            }), 7);

            test.done();
        },

        'You can reduce summation terms': function(test) {
            test.equal(mathUtils.mod({
                value: '016745145',
                factors: [2, 1],
                divider: 10,
                direction: 'rightToLeft',
                cumplimentaryToDivider: true,
                reduceSummationTerms: true
            }), 9);

            test.equal(mathUtils.mod({
                value: '01674514515721897666',
                factors: [2, 1],
                divider: 10,
                direction: 'rightToLeft',
                cumplimentaryToDivider: true,
                reduceSummationTerms: true
            }), 6);

            test.done();
        },

        'Additional tests 1': function(test) {
            var digit = mathUtils.mod({
                value:   [0, 0, 5, 7, 1, 2, 3, 4, 5, 1, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8].join(''),
                factors: [2, 1],
                divider: 10,
                direction: 'rightToLeft',
                reduceSummationTerms: true,
                cumplimentaryToDivider: true
            });

            test.equal(digit, 8);
            test.done();
        },

        'Additional tests 2': function(test) {
            var digit = mathUtils.mod({
                value: '06549868910900000001',
                factors: [2, 1],
                divider: 10,
                direction: 'rightToLeft',
                reduceSummationTerms: true,
                cumplimentaryToDivider: true
            });

            test.equal(digit, 3);
            test.done();
        },

        'Additional tests 3': function(test) {
            var digit = mathUtils.mod({
                value: '06549868910900000002',
                factors: [2, 1],
                divider: 10,
                direction: 'rightToLeft',
                reduceSummationTerms: true,
                cumplimentaryToDivider: true
            });

            test.equal(digit, 1);
            test.done();
        },
    },

    'convolve': {
        'Check that convolves properly': function(test){
            test.deepEqual(mathUtils.convolve([1, 1, 1], [0.5, 2, 2.5, 1]), [0.5, 2.5, 5, 5.5, 3.5, 1]);
            test.deepEqual(mathUtils.convolve([3, 4, 5], [2, 1]), [6, 11, 14, 5]);
            test.deepEqual(mathUtils.convolve([2, -2, 1], [1, 3, 0.5, -1]), [2, 4, -4, 0, 2.5, -1]);
            test.deepEqual(mathUtils.convolve([1, 2, 3, 4], [-1, 5, 3]), [-1, 3, 10, 17, 29, 12]);
            test.deepEqual(mathUtils.convolve([1, 2], [2, 1, 1, 1]), [2, 5, 3, 3, 2]);
            test.deepEqual(mathUtils.convolve([1, 2, 3, 4, 5], [1]), [1, 2, 3, 4, 5]);
            test.done();
        }
    },

    'multiplyPolynomials': {
        'Check that polynomials are multiplied properly': function(test){
            test.deepEqual(mathUtils.multiplyPolynomials([1, 1, 1], [0.5, 2, 2.5, 1]), [0.5, 2.5, 5, 5.5, 3.5, 1]);
            test.deepEqual(mathUtils.multiplyPolynomials([3, 4, 5], [2, 1]), [6, 11, 14, 5]);
            test.deepEqual(mathUtils.multiplyPolynomials([2, -2, 1], [1, 3, 0.5, -1]), [2, 4, -4, 0, 2.5, -1]);
            test.deepEqual(mathUtils.multiplyPolynomials([1, 2, 3, 4], [-1, 5, 3]), [-1, 3, 10, 17, 29, 12]);
            test.deepEqual(mathUtils.multiplyPolynomials([1, 2], [2, 1, 1, 1]), [2, 5, 3, 3, 2]);
            test.deepEqual(mathUtils.multiplyPolynomials([1, 2, 3, 4, 5], [1]), [1, 2, 3, 4, 5]);
            test.done();
        }
    },

    'solve': {
        //tested by mathUtilsNonStrictTest.js
    }
};
