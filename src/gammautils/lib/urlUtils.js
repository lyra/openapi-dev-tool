'use strict';

var path = require('path'),
    sUtils = require('./stringUtils.js');

module.exports.__name = 'Url';

function sortRoutes(routes, property) {
    return routes.sort(function(a, b) {
        var i;

        if(typeof property !== 'undefined') {
            a = a[property];
            b = b[property];
        }

        a = a.split('/');
        b = b.split('/');

        if(a.length !== b.length) {
            return a.length - b.length;
        } else {
            for(i = 0; i < a.length; i++) {
                if(a[i].indexOf(':') === 0) {
                    return 1;
                }

                if(b[i].indexOf(':') === 0) {
                    return -1;
                }
            }

            return 0;
        }
    });
}
module.exports.sortRoutes = sortRoutes;

function getParentFolder(url, level){
    if(url === '') {
        return '';
    }
    if(typeof level === 'undefined') {
        level = 1;
    }

    url = path.dirname(url).split('/').filter(function(segment){
        return segment !== '' && segment !== '.';
    });

    if(url.length > 0){
        var index = url.length - level;

        if(index < 0) {
            index = 0;
        }

        return '/' + url.splice(index, level).join('/');
    } else {
        return '';
    }
}
module.exports.getParentFolder = getParentFolder;

function getSubpaths(path){
    var result = [];

    path = path.split('/').filter(function(segment){
        return segment !== '';
    });

    path.forEach(function(segment, index){
        if(index === 0) {
            result.push(segment);
        } else {
            result.push(sUtils.joinUrls(result[index - 1], segment));
        }
    });

    return result;
}
module.exports.getSubpaths = getSubpaths;