'use strict';

var util = require('util');

module.exports.__name = 'Object';

function isUndefined(object){
    return typeof object === typeof undefined;
}
module.exports.isUndefined = isUndefined;

function noop() {}
module.exports.noop = noop;

function forEachOwnProperty(object, iterator) {
    if(typeof object !== 'object' || object === null) {
        return;
    }

    var propertiesLength = Object.keys(object).length,
        current = 1;

    for(var property in object){
        if(object.hasOwnProperty(property)) {
            if(iterator(property, object[property], current++ < propertiesLength) === 'break') {
                break;
            }
        }
    }
}
module.exports.forEachOwnProperty = forEachOwnProperty;

function merge(destination, source) {
    if(isUndefined(destination)) {
        destination = {};
    }

    if(isUndefined(source)) {
        source = {};
    }

    forEachOwnProperty(source, function(property, value) {
        destination[property] = value;
    });

    return destination;
}
module.exports.merge = merge;

function flatten(object, join, root) {
    if(!object || typeof object !== 'object') {
        return object;
    }

    if(typeof join === 'string') {
        root = join;
        join = null;
    }

    if(!join) {
        join = function(a, b) {
            if(!a) {
                return b;
            }

            return a + '.' + b;
        };
    }

    var result = {};

    forEachOwnProperty(object, function(key, value) {
        if(typeof value === 'object' && !value instanceof RegExp && !util.isDate(value)) {
            return merge(result, flatten(value, join, join(root, key)));
        } else {
            result[join(root, key)] = value;
            return result;
        }
    });

    return result;
}
module.exports.flatten = flatten;

function unflatten(object, separator) {
    var result = {};

    if(isUndefined(separator)) {
        separator = '.';
    }

    function getContainer(property) {
        if(/^\+?(0|[1-9]\d*)$/.test(property)) {
            return [];
        } else {
            return {};
        }
    }

    forEachOwnProperty(object, function(property, messages) {
        property = property.split(separator);

        var currentNode = result;

        for(var i = 0; i < property.length; i++) {
            var currentProperty = property[i];

            if(isUndefined(currentNode[currentProperty])) {
                if(i === property.length - 1) {
                    currentNode[currentProperty] = messages;
                } else {
                    currentNode[currentProperty] = getContainer(property[i + 1]);
                }
            }

            currentNode = currentNode[currentProperty];
        }
    });

    return result;
}
module.exports.unflatten = unflatten;

function deepSet(object, property, value) {
    if(isUndefined(object) || object === null) {
        return false;
    }

    if(!Array.isArray(property)) {
        property = property.split('.');
    }

    if(property.length > 1) {
        var currentProperty = property.shift();

        if(isUndefined(object[currentProperty])) {
            if(/\d+/.test(property[0])) {
                object[currentProperty] = [];
            } else {
                object[currentProperty] = {};
            }
        }

        return deepSet(object[currentProperty], property, value);
    } else {
        object[property.shift()] = value;
        return true;
    }
}
module.exports.deepSet = deepSet;

function deepMerge(destination, source) {
    if(isUndefined(destination)) {
        destination = {};
    }

    if(isUndefined(source)) {
        source = {};
    }

    forEachOwnProperty(flatten(source), function(key, value) {
        deepSet(destination, key, value);
    });

    return destination;
}
module.exports.deepMerge = deepMerge;

function deepDelete(object, property) {
    if(typeof object === 'undefined') {
        return false;
    }

    if(!Array.isArray(property)) {
        property = property.split('.');
    }

    if(property.length > 1) {
        return deepDelete(object[property.shift()], property);
    } else {
        if(typeof object[property[0] !== 'undefined']) {
            delete object[property[0]];
            return true;
        } else {
            return false;
        }
    }
}
module.exports.deepDelete = deepDelete;

function resolveProperty(object, property, deep) {
    if(typeof deep === 'undefined') {
        deep = true;
    }

    if(typeof property === 'string' && deep) {
        property = property.split('.');
    }

    if(!object) {
        return null;
    }

    if(!deep) {
        property = Array.isArray(property) ? property[0] : property;

        if(typeof property === 'undefined') {
            return object;
        } else {
            return object[property];
        }
    }

    return resolveProperty(object[property.shift()], property, property.length > 1);
}
module.exports.resolveProperty = resolveProperty;

function isObject(object){
    return typeof object === 'object';
}
module.exports.isObject = isObject;

function isArray(object){
    return util.isArray(object);
}
module.exports.isArray = isArray;

module.exports.values = function(object){
    var key,
        values = [];

    if(!isObject(object) || isArray(object)) {
        throw new Error('Invalid parameter');
    }

    for(key in object) {
        if(object.hasOwnProperty(key)) {
            values.push(object[key]);
        }
    }

    return values;
};

module.exports.keys = function(object){
    var key,
        keys = [];

    if(!isObject(object) || isArray(object)) {
        throw new Error('Invalid parameter');
    }

    for(key in object) {
        if(object.hasOwnProperty(key)) {
            keys.push(key);
        }
    }

    return keys;
};

function prune(object, blacklist) {
    if(isUndefined(object) || isUndefined(blacklist)) {
        return object;
    }

    if(typeof blacklist === 'string') {
        blacklist = blacklist.split(',').map(function(key) {
            return key.trim();
        });
    }

    var isArray = Array.isArray(object);

    if(!isArray) {
        object = [object];
    }

    object = object.map(function(result) {

        if(result === null || typeof result === 'undefined') {
            return null;
        }

        blacklist.forEach(function(propertyToRemove) {
            delete result[propertyToRemove];
        });

        return result;
    });

    if(isArray) {
        return object;
    } else {
        return object[0];
    }
}
module.exports.prune = prune;

function pick(objects, whitelist){

    if(isUndefined(whitelist)) {
        return {};
    }

    var isArray = Array.isArray(objects),
        blacklist = [];

    if(!isArray) {
        objects = [objects];
    }

    objects.forEach(function(object){

        Object.keys(object).forEach(function(key) {

            if(whitelist.indexOf(key) === -1 && blacklist.indexOf(key) === -1){
                blacklist.push(key);
            }
        });
    });

    objects = prune(objects, blacklist);

    if(isArray) {
        return objects;
    } else {
        return objects[0];
    }
}
module.exports.pick = pick;

module.exports.isEmpty = function(object){
    if(typeof object !== 'object') {
        return false;
    }

    for(var prop in object) {
        if(object.hasOwnProperty(prop)) {
            return false;
        }
    }

    return true;
};

module.exports.isBoolean = function(object) {
    return typeof object === 'boolean';
};

module.exports.isString = function(object) {
    return typeof object === 'string';
};

module.exports.isNumber = function(object) {
    return !isNaN(parseFloat(object)) && isFinite(object);
};

module.exports.argsToArray = function(args, startingFrom){
    if(isUndefined(startingFrom)) {
        startingFrom = 0;
    }

    return Array.prototype.slice.call(args, startingFrom);
};