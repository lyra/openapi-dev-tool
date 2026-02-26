'use strict';

var urlUtils = require('../lib/urlUtils');

module.exports = {
    '__name': { '': function(test) { test.done(); } },
    '__description': { '': function(test) { test.done(); } },
    'sortRoutes': {
        'Can sort routes in array of strings': function(test) {
            var routes = ['/user/:id', '/user/:id/preferences', '/', '/users', '/users/:group'],
                expected = ['/', '/users', '/users/:group', '/user/:id', '/user/:id/preferences'];

            test.deepEqual(urlUtils.sortRoutes(routes), expected);
            test.done();
        },

        'Can sort routes in array of objects': function(test) {
            var routes = [{ path: '/user/:id' }, { path: '/user/:id/preferences' }, { path: '/' }, { path: '/users' }, { path: '/users/:group' }],
                expected = [{ path: '/' }, { path: '/users' }, { path: '/users/:group' }, { path: '/user/:id' }, { path: '/user/:id/preferences' }];


            test.deepEqual(urlUtils.sortRoutes(routes, 'path'), expected);
            test.done();
        }
    },

    'getSubpaths': {
        'Works as expected': function(test){
            test.deepEqual(urlUtils.getSubpaths('/this/is/a/test'), [
                'this',
                'this/is',
                'this/is/a',
                'this/is/a/test'
            ]);

            test.done();
        }
    },

    'getParentFolder': {
        'Works as expected': function(test){
            test.equal(urlUtils.getParentFolder(''), '');
            test.equal(urlUtils.getParentFolder('picture1.png'), '');
            test.equal(urlUtils.getParentFolder('/this/is/a/test/picture1.png'), '/test');
            test.equal(urlUtils.getParentFolder('/this/is/a/test/picture1.png', 1), '/test');
            test.equal(urlUtils.getParentFolder('/this/is/a/test/picture1.png', 2), '/a/test');
            test.equal(urlUtils.getParentFolder('/this/is/a/test/picture1.png', 3), '/is/a/test');
            test.equal(urlUtils.getParentFolder('/this/is/a/test/picture1.png', 4), '/this/is/a/test');
            test.equal(urlUtils.getParentFolder('/this/is/a/test/picture1.png', 5), '/this/is/a/test');
            test.equal(urlUtils.getParentFolder('/this/is/a/test/picture1.png', 6), '/this/is/a/test');

            test.done();
        },

        'Outputs same results even without leading slash': function(test){

            test.equal(urlUtils.getParentFolder('this/is/a/test/picture1.png'), '/test');
            test.equal(urlUtils.getParentFolder('this/is/a/test/picture1.png', 1), '/test');
            test.equal(urlUtils.getParentFolder('this/is/a/test/picture1.png', 2), '/a/test');
            test.equal(urlUtils.getParentFolder('this/is/a/test/picture1.png', 3), '/is/a/test');
            test.equal(urlUtils.getParentFolder('this/is/a/test/picture1.png', 4), '/this/is/a/test');
            test.equal(urlUtils.getParentFolder('this/is/a/test/picture1.png', 5), '/this/is/a/test');
            test.equal(urlUtils.getParentFolder('this/is/a/test/picture1.png', 6), '/this/is/a/test');

            test.done();
        }
    }
};