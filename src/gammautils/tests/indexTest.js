'use strict';

var fs = require('fs'),
    path = require('path'),
    alltested = require('alltested'),
    utils = require('../index');

module.exports = {
    'Checks that every submodule is available': function(test){
        fs.readdirSync(__dirname + '/../lib').forEach(function(file){
            var match = file.match(/^(.*)Utils\.js$/);

            if(match){
                test.ok(utils[match[1]], file + ' is not being exposed');
            }
        });

        test.done();
    },

    'Ensures there is a test for every function': function(test){
        var appPath = path.resolve(path.join(__dirname, '/../lib')),
            testsPath = __dirname;

        alltested(appPath, testsPath, {
            ignore: ['accentMap.js',
                     'index.js']
        });

        test.done();
    }
};