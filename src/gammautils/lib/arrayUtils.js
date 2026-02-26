'use strict';

var objectUtils = require('./objectUtils'),
    util = require('util'),
    mathUtils = require('./mathUtils'),
    arrayUtils = module.exports;

module.exports.__name = 'Array';
module.exports.__description = 'Utilities for dealing with arrays';

function Group(type) {
    if(typeof type === 'undefined') {
        type = 'array';
    } else {
        type = 'single';
    }

    var self = this,
        data = {};

    this.length = 0;

    this.add = function(key, value, meta) {
        value = {value: value, meta: meta};

        if(type === 'array') {
            if(typeof data[key] === 'undefined') {
                this.length++;
                data[key] = [];
            }

            data[key].push(value);
        } else {
            if(typeof data[key] === 'undefined') {
                this.length++;
            }

            data[key] = value;
        }

        return self;
    };

    this.remove = function(key) {
        if(typeof data[key] !== 'undefined') {
            delete data[key];
            this.length--;
        }
    };

    this.addIfNone = function(key, value, meta){
        if(typeof data[key] === 'undefined') {
            if(typeof value === 'function') {
                value = value();
            }

            return this.add(key, value, meta);
        }

        return self;
    };

    this.get = function(key) {
        return data[key];
    };

    this.forEach = function(fn) {
        for (var prop in data) {
            if (data.hasOwnProperty(prop)) {
                fn(prop, data[prop]);
            }
        }

        return self;
    };

    this.raw = function() {
        return data;
    };
}

module.exports.Group = Group;

module.exports.pushIfNotAlready = function(array, item) {
    if(array.indexOf(item) === -1) {
        array.push(item);
    }

    return array;
};

function shuffle(array) {
    //http://en.wikipedia.org/wiki/Fisher-Yates_shuffle

    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

module.exports.shuffle = shuffle;

function groupBySync(array, groupingFunction, toArray) {
    var result = {};

    array.forEach(function(item, index) {
        var prop = groupingFunction(item, index), value;

        if(Array.isArray(prop)) {
            value = prop[1];
            prop = prop[0];
        } else if(typeof prop === 'object') {
            value = prop.value;
            prop = prop.group;
        } else {
            value = item;
        }

        if(result[prop]) {
            result[prop].push(value);
        } else {
            result[prop] = [value];
        }
    });

    if(toArray) {
        var result2 = [];
        for ( var groupName in result) {
            if (result.hasOwnProperty(groupName)) {
                result2.push(toArray(groupName, result[groupName]));
            }
        }

        result = result2;
    }

    return result;
}

module.exports.groupBySync = groupBySync;

function groupBy(array, groupingFunction, toArray, cb) {
    if(objectUtils.isUndefined(cb)) {
        cb = toArray;
        toArray = null;
    }

    var result = {}, index = 0;

    function getGroup(item) {
        groupingFunction(item, function(err, prop) {
            if(err) {
                return cb(err);
            }

            var value;

            if(Array.isArray(prop)) {
                value = prop[1];
                prop = prop[0];
            } else if(typeof prop === 'object') {
                value = prop.value;
                prop = prop.group;
            } else {
                value = item;
            }

            if(result[prop]) {
                result[prop].push(value);
            } else {
                result[prop] = [value];
            }

            if(index === array.length - 1) {
                processGroups();
            } else {
                index = index + 1;
                getGroup(array[index]);
            }
        });
    }

    getGroup(array[index]);

    function processGroups() {
        if(toArray) {
            var result2 = [];
            for ( var groupName in result) {
                if (result.hasOwnProperty(groupName)) {
                    result2.push(toArray(groupName, result[groupName]));
                }
            }

            result = result2;
        }

        cb(null, result);
    }
}

module.exports.groupBy = groupBy;

module.exports.sort = function(array, options) {
    options = objectUtils.merge({
        order: 'asc',
        deep: true,
        transform: function(value) {
            return value;
        }
    }, options);

    var getFromProperty = !objectUtils.isUndefined(options.property);
    options.order = options.order === 'asc' ? 1 : -1;

    return array.sort(function sorter(a, b) {
        a = getFromProperty ? objectUtils.resolveProperty(a, options.property, options.deep) : a;
        b = getFromProperty ? objectUtils.resolveProperty(b, options.property, options.deep) : b;

        a = options.transform(a);
        b = options.transform(b);

        if(objectUtils.isString(a) && objectUtils.isString(b)) {
            return a.localeCompare(b) * options.order;
        }

        return (a - b) * options.order;
    });
};

module.exports.toUpperCase = function(array) {
    return array.map(function(item) {
        return typeof item === 'string' ? item.toUpperCase() : item;
    });
};

module.exports.toLowerCase = function(array) {
    return array.map(function(item) {
        return typeof item === 'string' ? item.toLowerCase() : item;
    });
};

//module.exports._docs = {
//    description: 'A collection of utility methods to deal with arrays'
//};

module.exports.getRandomItem = function(array){
    return array[Math.floor(Math.random() * array.length)];
};

module.exports.getRandomItem.__docs = {
    description: 'Returns a random item from the array',
    parameters: [{
        name: 'array',
        type: 'array',
        optional: false,
        description: 'The array where the element will be extracted'
    }],
    example: function() {
        return arrayUtils.getRandomItem([1, 2, 3, 4]);
    }
};

function getNumberFrom(object, property) {
    var getFromProperty = typeof property !== 'undefined';

    return parseFloat(getFromProperty ? (util.isDate(object[property]) ? object[property].valueOf() : object[property]) : object, 10);
}

function findByComparator(array, strategy, property) {
    var getFromProperty = typeof property !== 'undefined';

    return array.reduce(function(a, b, index) {
        a = getNumberFrom(a, property);
        b = getNumberFrom(b, property);

        var found = strategy(a, b);

        if(getFromProperty) {
            var result = {};
            result[property] = found;

            return index === array.length - 1 ? found : result;
        } else {
            return found;
        }
    });
}

module.exports.smaller = function(array, property) {
    return findByComparator(array, mathUtils.smaller, property);
};

module.exports.bigger = function(array, property) {
    return findByComparator(array, mathUtils.bigger, property);
};

module.exports.average = function(array) {
    return array.reduce(function(a, b) {
        return parseInt(a, 10) + parseInt(b, 10);
    }) / array.length;
};

module.exports.movingAverage = function(array, length){
    var result = [];

    if(array.length < length) {
        return result;
    }

    var accumulator = 0;
    for(var i = length - 1; i < array.length; i++){
        for(var j = 0; j < length; j++){
            accumulator += parseFloat(array[i - j], 10);
        }

        result.push(accumulator/length);
        accumulator = 0;
    }

    return result;
};

module.exports.movingAverage._docs = {
        description: 'Returns an array containing the values of the moving avarage of the given array',
        parameters: [{
            name: 'array',
            type: 'array',
            optional: false,
            description: 'The source array where the element will be extracted'
        }, {
            name: 'length',
            type: 'number',
            optional: false,
            description: 'The number of samples to calculate get the average. This value can\'t be greater than the array length'
        }]
    };

function getValue(element, property){
    if(objectUtils.isNumber(element)) {
        return parseFloat(element, 10);
    }
    else if(objectUtils.isString(element)) {
        return element;
    }
    else if(property in element) {
        return parseFloat(element[property], 10);
    }
    else {
        throw new Error('Property "' + property + '" was not found on array\'s element');
    }
}

function every(array) {
    return array.every(function(value) {
        return value;
    });
}

module.exports.every = every;

module.exports.multiply = function(array, property){
    return array.reduce(function(a, b){ return getValue(a, property) * getValue(b, property); }, 1);
};

module.exports.multiply.__docs = {
    description: 'Multiplies every element within an array',
    parameters: [{
        name: 'array',
        optional: false,
        description: 'The source array'
    }, {
        name: 'propety',
        type: 'string',
        optional: true,
        description: 'If the array contains objects instead of numbers this property represents what property of the object will be multiplied'
    }]
};

function sum(array, property, fn){
    if(objectUtils.isUndefined(fn)) {
        fn = function(a, b, index){
            if(index === 0 && typeof b === 'string') {
                a = '';
            }
            if(index === 0 && typeof b !== 'string') {
                a = 0;
            }

            return getValue(a, property) + getValue(b, property);
        };
    }

    return array.reduce(fn, 0);
}
module.exports.sum = sum;

function removeAt(array, index){
    array.splice(index, 1);
}
module.exports.removeAt = removeAt;

module.exports.removeLast = function(array){
    removeAt(array, array.length - 1);
};


module.exports.insertAt = function(array, index, element){
    array.splice(index, 0, element);
};

module.exports.series = function(from, to){
    var params = [from, to];
    if(from > to) {
        params = [to, from];
    }

    var result = [];
    while(params[0] <= params[1]) {
        result.push(params[0]++);
    }

    return from > to ? result.reverse() : result;
};

module.exports.pretty = function(array, lastSeparator){
    if(objectUtils.isUndefined(lastSeparator)) {
        lastSeparator = 'e';
    }

    return array.toString().replace(/,/g, ', ').replace(/,\s([^,]+)$/, ' ' + lastSeparator + ' $1');
};

module.exports.clean = function(array, deleteValue) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === deleteValue) {
            array.splice(i, 1);
            i--;
        }
    }

    return array;
};

module.exports.intersection = function(a, b, filter){
    if(typeof filter === 'undefined') {
        return b.filter(function(element) {
            return a.indexOf(element) !== -1;
        });
    }

    var result = [];

    a.forEach(function(aElement) {
        b.forEach(function(bElement) {
            if(filter(aElement, bElement)) {
                result.push(aElement);
            }
        });
    });

    return result;
};

module.exports.toDictionary = function(array, key){
    var result = {};
    array.forEach(function(element){
        result[element[key]] = element;
    });

    return result;
};

module.exports.chop = function(array, quantity){
    var result = [];

    var subArray = [];
    var count = 0;
    array.forEach(function(element){
        if(count === quantity){
            result.push(subArray);
            subArray = [];
            count = 0;
        }

        subArray.push(element);
        count++;
    });

    if(subArray.length > 0) {
        result.push(subArray);
    }

    return result;
};
