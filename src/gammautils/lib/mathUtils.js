'use strict';

var objectUtils = require('./objectUtils'),
    arrayUtils = require('./arrayUtils'),
    stringUtils = require('./stringUtils'),
    mathUtilsNonStrict = require('./mathUtilsNonStrict');

module.exports.__name = 'Math';

module.exports.smaller = function(a, b) {
    return a < b ? a : b;
};

module.exports.bigger = function(a, b) {
    return a > b ? a : b;
};

function MovingAverage(samplesToCount, fill, weighted, property) {
    var acumulator = [],
        getFromProperty = typeof property !== 'undefined';

    if(Array.isArray(weighted) && weighted.length !== samplesToCount) {
        return new Error('Array of weights have same length as samples to count');
    }

    function factor(index) {
        if(weighted === true) {
            return index + 1;
        } else if(Array.isArray(weighted)) {
            return weighted[index];
        } else {
            return 1;
        }
    }

    function average() {
        if(weighted === true) {
            //Summation of X, from X = 0 up to N
            return ((Math.pow(acumulator.length, 2) + acumulator.length) / 2);
        } else if(Array.isArray(weighted)) {
            return arrayUtils.sum(weighted.slice(0, acumulator.length));
        } else {
            return acumulator.length;
        }
    }

    this.add = function(data) {
        acumulator.push(parseInt(getFromProperty ? data[property] : data, 10));

        if(acumulator.length === samplesToCount || fill) {
            var value = acumulator.reduce(function(previous, current, index) {
                return previous + (current * factor(index));
            }, 0) / average();

            if(acumulator.length === samplesToCount) {
                acumulator.shift();
            }

            return value;
        } else {
            return undefined;
        }
    };
}

module.exports.MovingAverage = MovingAverage;

function Minimum(property) {
    var getFromProperty = typeof property !== 'undefined';

    this.current = null;

    this.compare = function(data) {
        data = parseInt(getFromProperty ? data[property] : data, 10);

        if(this.current === null || data < this.current) {
            this.current = data;
        }
    };
}

module.exports.Minimum = Minimum;

function Maximum(property) {
    var getFromProperty = typeof property !== 'undefined';

    this.current = null;

    this.compare = function(data) {
        data = parseInt(getFromProperty ? data[property] : data, 10);

        if(this.current === null || data > this.current) {
            this.current = data;
        }
    };
}

module.exports.Maximum = Maximum;

var Average = function(property) {
    var acumulator = [],
        getFromProperty = typeof property !== 'undefined';

    this.add = function(data) {
        this.length++;

        acumulator.push(parseInt(getFromProperty ? data[property] : data, 10));

        this.result = acumulator.reduce(function(a, b) {
            return a + b;
        }) / acumulator.length;
    };

    this.length = 0;
    this.result = null;
};

module.exports.Average = Average;

module.exports.LinearRegression = function(propertyX, propertyY) {
    if(typeof propertyX === 'undefined') {
        propertyX = 'x';
    }

    if(typeof propertyY === 'undefined') {
        propertyY = 'y';
    }

    var sumOfX = 0,
        sumOfY = 0,
        sumOfXY = 0,
        sumOfXX = 0,
        sumOfYY = 0,
        divisor = 1,
        lastX = null,
        nextIsAvailable = true,
        xAverage = new Average();

    this.length = 0;

    this.add = function(sample) {
        var x = parseInt(sample[propertyX], 10),
            y = parseInt(sample[propertyY], 10);

        this.length++;

        if(lastX) {
            if(x < lastX) {
                nextIsAvailable = false;
            }

            xAverage.add(Math.abs(x - lastX));
        }

        lastX = x;

        sumOfX += x;
        sumOfY += y;
        sumOfXY += x * y;
        sumOfXX += x * x;
        sumOfYY += y * y;
        divisor = ((this.length * sumOfXX) - (sumOfX * sumOfX));
    };

    this.a = function() {
        return ((sumOfXX * sumOfY) - (sumOfXY * sumOfX)) / divisor;
    };

    this.b = function() {
        return ((this.length * sumOfXY) - (sumOfX * sumOfY)) / divisor;
    };

    this.correlation = function() {
        return ((this.length * sumOfXY) - (sumOfX * sumOfY)) / (Math.sqrt((this.length * sumOfXX) - (sumOfX * sumOfX)) * Math.sqrt((this.length * sumOfYY) - (sumOfY * sumOfY)));
    };

    this.calculate = function(x) {
        return this.a() + (this.b() * x);
    };

    this.next = function() {
        if(!nextIsAvailable) {
            return new Error('To use the the "next" function your must add samples in ascending order of X');
        }

        var nextX = lastX + xAverage.result;

        lastX = nextX;

        return {
            x: nextX,
            y: this.calculate(nextX)
        };
    };
};

module.exports.linearRegression = function(samples) {
    var length = samples.length,
        sumOfX = 0,
        sumOfY = 0,
        sumOfXY = 0,
        sumOfXX = 0;

    samples.forEach(function(sample) {
        sumOfX += sample.x;
        sumOfY += sample.y;
        sumOfXY += sample.x * sample.y;
        sumOfXX += sample.x * sample.x;
    });

    var divisor = ((length * sumOfXX) - (sumOfX * sumOfX)),
        a = ((sumOfXX * sumOfY) - (sumOfXY * sumOfX)) / divisor,
        b = ((length * sumOfXY) - (sumOfX * sumOfY)) / divisor;

    return {
        a: a,
        b: b,
        fn: function(x) {
            return a + (b * x);
        }
    };
};

module.exports.bigSum = function(a, b) {
    a = a.toString();
    b = b.toString();

    var biggest = (a.length > b.length ? a : b),
        smallest = (a.length <= b.length ? a : b),
        rest,
        result = '';

    a = stringUtils.pad(smallest, biggest.length, '0').split('');
    b = biggest.split('');

    rest = b.reduceRight(function(rest, current, index){
        var aDigit = parseInt(a[index], 10),
            bDigit = parseInt(b[index], 10),
            sum = aDigit + bDigit + rest;

        result = (sum > 9 ? sum - 10 : sum) + result;
        return sum > 9 ? 1 : 0;
    }, 0);

    return rest === 0 ? result : '1' + result;
};

module.exports.median = function(array) {
    return array.reduce(function(a, b) {
        return a + b;
    }) / array.length;
};

module.exports.pearsonCoefficient = function(a, b) {
    var sumA = 0,
        sumB = 0,
        sumASquared = 0,
        sumBSquared = 0,
        sumAB = 0,
        intersection = 0,

        property;

    for(property in a) {
        if(a.hasOwnProperty(property) && b && b.hasOwnProperty(property)){
            sumA += a[property];
            sumB += b[property];

            sumASquared += Math.pow(a[property], 2);
            sumBSquared += Math.pow(b[property], 2);

            sumAB += a[property] * b[property];
            intersection++;
        }
    }

    if(intersection === 0) {
        return 0;
    }

    var num = sumAB - (sumA * sumB / intersection);
    var den = Math.sqrt((sumASquared - Math.pow(sumA, 2) / intersection) *
                        (sumBSquared - Math.pow(sumB, 2) / intersection));

    return den === 0 ? 0 : num / den;
};

module.exports.euclideanDistance = function(a, b){
    var sum = 0,

        property;

    for(property in a) {
        if(a.hasOwnProperty(property) && b && b.hasOwnProperty(property)) {
            sum += Math.pow(a[property] - b[property], 2);
        }
    }

    return Math.sqrt(sum);
};


module.exports.solve = mathUtilsNonStrict.solve;

function sum(a, b) {
    return a + b;
}

module.exports.sum = sum;

function subtract(a, b) {
    return a - b;
}

module.exports.subtract = subtract;

module.exports.mod = function(value, factors, divider, direction){

    var reduceSummationTerms = false,
        cumplimentaryToDivider = false;

    if(arguments.length === 1 && typeof value === 'object') {
        factors = value.factors;
        divider = value.divider;
        direction = value.direction;
        reduceSummationTerms = value.reduceSummationTerms;
        cumplimentaryToDivider = value.cumplimentaryToDivider;
        value = value.value;
    }

    if(objectUtils.isUndefined(divider)) {
        divider = 11;
    }

    if(objectUtils.isUndefined(factors)) {
        factors = arrayUtils.series(2, 9);
    }

    if(objectUtils.isUndefined(direction)) {
        direction = 'rightToLeft';
    }

    var reduceMethod = direction === 'leftToRight' ? 'reduce' : 'reduceRight';

    var i = 0;
    var result = value.split('')[reduceMethod](function(last, current){
        if(i > factors.length - 1) {
            i = 0;
        }

        var total = factors[i++] * parseInt(current, 10);

        if(reduceSummationTerms) {
            total = total.toString().split('').map(Number).reduce(sum, 0);
        }

        return total + last;
    }, 0) % divider;

    if(cumplimentaryToDivider) {
        result = divider - result;
    }

    return result;
};

function convolve(signal1, signal2){
    var signal1Length = signal1.length,
        signal2Length = signal2.length,
        finalSize = signal1Length + signal2Length - 1;

    var result = new Array(finalSize);

    for (var i = 0; i < finalSize; i++) {
        result[i] = 0;

        for (var j = 0; j < signal2Length; j++) {
            if(i - j < 0) {
                continue;
            }
            if(i - j >= signal1Length) {
                continue;
            }

            result[i] += signal2[j] * signal1[i - j];
        }
    }

    return result;
}

module.exports.convolve = convolve;
module.exports.multiplyPolynomials = convolve;

function getPrimeFactors(number) {
    var factors = [], factor;

    function getPrimeFactor(number) {
        for (var i = 2; i <= Math.sqrt(number); i++) {
            if(number % i === 0) {
                return i;
            }
        }

        return number;
    }

    while(/* jshint -W084 */ factor = getPrimeFactor(number)) {
        factors.push(factor);
        number /= factor;

        if(number === 1) {
            break;
        }
    }

    return factors;
}
module.exports.getPrimeFactors = getPrimeFactors;

function isPrime(number) {
    if(number === 2) {
        return true;
    } else if(number % 2 === 0) {
        return false;
    }

    return getPrimeFactors(number).length === 1;
}
module.exports.isPrime = isPrime;