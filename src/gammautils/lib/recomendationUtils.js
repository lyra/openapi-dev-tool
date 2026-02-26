'use strict';

var mathUtils = require('./mathUtils');

module.exports.__name = 'Recomendation';

module.exports.similarityByEuclideanDistance = function(a, b){
    return 1/(1 + mathUtils.euclideanDistance(a, b));
};

module.exports.similarityByPearsonCoefficient = function(a, b){
    return mathUtils.pearsonCoefficient(a, b);
};