'use strict';

module.exports.__name = 'Boolean';

module.exports.isTrue = function(value) {
    return ['on', 'true', 'yes', 1, true].indexOf(value) > -1;
};