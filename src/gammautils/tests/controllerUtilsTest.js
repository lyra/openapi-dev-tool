'use strict';

var controllerUtils = require('../lib/controllerUtils');

function Mock(headers, onNext) {
    this.req = { headers: headers || {} };

    this.res = {
        headerWasCalledWith: [],
        header: function(header, value) {
            console.log('>>>', header, value)
            this.res.headerWasCalledWith.push({
                header: header,
                value: value
            });
        }.bind(this)
    };

    this.nextWasCalled = false;
    this.next = function(err) {
        this.nextWasCalled = true;
        onNext && onNext(err);
    }.bind(this);
}

module.exports = {
    '__name': { '': function(test) { test.done(); } },
    '__description': { '': function(test) { test.done(); } },
    loadAction: {
        'hard to test': function(test) {
            //hard to test
            test.done();
        },
    },

    'acceptJson': {
        'Verify proper headers were set': function(test) {
            var mock = new Mock();
            controllerUtils.acceptJson(mock.req, mock.res, mock.next);

            test.ok(mock.nextWasCalled);
            test.equal(mock.req.headers.accept, 'application/json');
            test.equal(mock.res.lean, true);
            test.done();
        }
    },

    'acceptXml': {
        'Verify proper headers were set': function(test) {
            var mock = new Mock();
            controllerUtils.acceptXml(mock.req, mock.res, mock.next);

            test.ok(mock.nextWasCalled);
            test.equal(mock.req.headers.accept, 'application/xml');
            test.equal(mock.res.lean, true);
            test.done();
        }
    },

    'acceptCsv': {
        'Verify proper headers were set': function(test) {
            var mock = new Mock();
            controllerUtils.acceptCsv(mock.req, mock.res, mock.next);

            test.ok(mock.nextWasCalled);
            test.equal(mock.req.headers.accept, 'text/csv');
            test.equal(mock.res.lean, true);
            test.done();
        }
    },
    'allowCORS': {
        'Verify that defaults are applied': function(test) {
            var mock = new Mock();
            var allowCORS = controllerUtils.allowCORS(/* should apply defaults */);

            allowCORS(mock.req, mock.res, mock.next);

            test.equal(mock.res.headerWasCalledWith.length, 4);
            test.deepEqual(mock.res.headerWasCalledWith[0], {
                header: 'Access-Control-Allow-Origin',
                value: '*'
            });
            test.deepEqual(mock.res.headerWasCalledWith[1], {
                header: 'Access-Control-Allow-Methods',
                value: 'GET,PUT,POST,DELETE,HEAD,OPTIONS'
            });
            test.deepEqual(mock.res.headerWasCalledWith[2], {
                header: 'Access-Control-Allow-Headers',
                value: 'Content-Type, Authorization, Content-Length, X-Requested-With'
            });
            test.deepEqual(mock.res.headerWasCalledWith[3], {
                header: 'Access-Control-Expose-Headers',
                value: ''
            });
            test.ok(mock.nextWasCalled);
            test.done();
        },

        'Verify that parameters are applied while keep defaults for non-supplied parameters 1': function(test) {
            var mock = new Mock();
            var allowCORS = controllerUtils.allowCORS({
                allowOrigin: 'whatever I want'
            });

            allowCORS(mock.req, mock.res, mock.next);

            test.equal(mock.res.headerWasCalledWith.length, 4);
            test.deepEqual(mock.res.headerWasCalledWith[0], {
                header: 'Access-Control-Allow-Origin',
                value: 'whatever I want'
            });
            test.deepEqual(mock.res.headerWasCalledWith[1], {
                header: 'Access-Control-Allow-Methods',
                value: 'GET,PUT,POST,DELETE,HEAD,OPTIONS'
            });
            test.deepEqual(mock.res.headerWasCalledWith[2], {
                header: 'Access-Control-Allow-Headers',
                value: 'Content-Type, Authorization, Content-Length, X-Requested-With'
            });
            test.deepEqual(mock.res.headerWasCalledWith[3], {
                header: 'Access-Control-Expose-Headers',
                value: ''
            });
            test.ok(mock.nextWasCalled);
            test.done();
        },

        'Verify that parameters are applied while keep defaults for non-supplied parameters 2': function(test) {
            var mock = new Mock();
            var allowCORS = controllerUtils.allowCORS({
                allowMethods: 'whatever I want'
            });

            allowCORS(mock.req, mock.res, mock.next);

            test.equal(mock.res.headerWasCalledWith.length, 4);
            test.deepEqual(mock.res.headerWasCalledWith[0], {
                header: 'Access-Control-Allow-Origin',
                value: '*'
            });
            test.deepEqual(mock.res.headerWasCalledWith[1], {
                header: 'Access-Control-Allow-Methods',
                value: 'whatever I want'
            });
            test.deepEqual(mock.res.headerWasCalledWith[2], {
                header: 'Access-Control-Allow-Headers',
                value: 'Content-Type, Authorization, Content-Length, X-Requested-With'
            });
            test.deepEqual(mock.res.headerWasCalledWith[3], {
                header: 'Access-Control-Expose-Headers',
                value: ''
            });
            test.ok(mock.nextWasCalled);
            test.done();
        },

        'Verify that parameters are applied while keep defaults for non-supplied parameters 3': function(test) {
            var mock = new Mock();
            var allowCORS = controllerUtils.allowCORS({
                allowHeaders: 'whatever I want'
            });

            allowCORS(mock.req, mock.res, mock.next);

            test.equal(mock.res.headerWasCalledWith.length, 4);
            test.deepEqual(mock.res.headerWasCalledWith[0], {
                header: 'Access-Control-Allow-Origin',
                value: '*'
            });
            test.deepEqual(mock.res.headerWasCalledWith[1], {
                header: 'Access-Control-Allow-Methods',
                value: 'GET,PUT,POST,DELETE,HEAD,OPTIONS'
            });
            test.deepEqual(mock.res.headerWasCalledWith[2], {
                header: 'Access-Control-Allow-Headers',
                value: 'whatever I want'
            });
            test.deepEqual(mock.res.headerWasCalledWith[3], {
                header: 'Access-Control-Expose-Headers',
                value: ''
            });
            test.ok(mock.nextWasCalled);
            test.done();
        },

        'Verify that parameters are applied while keep defaults for non-supplied parameters 4': function(test) {
            var mock = new Mock();
            var allowCORS = controllerUtils.allowCORS({
                exposeHeaders: 'Location'
            });

            allowCORS(mock.req, mock.res, mock.next);

            test.equal(mock.res.headerWasCalledWith.length, 4);
            test.deepEqual(mock.res.headerWasCalledWith[0], {
                header: 'Access-Control-Allow-Origin',
                value: '*'
            });
            test.deepEqual(mock.res.headerWasCalledWith[1], {
                header: 'Access-Control-Allow-Methods',
                value: 'GET,PUT,POST,DELETE,HEAD,OPTIONS'
            });
            test.deepEqual(mock.res.headerWasCalledWith[2], {
                header: 'Access-Control-Allow-Headers',
                value: 'Content-Type, Authorization, Content-Length, X-Requested-With'
            });
            test.deepEqual(mock.res.headerWasCalledWith[3], {
                header: 'Access-Control-Expose-Headers',
                value: 'Location'
            });
            test.ok(mock.nextWasCalled);
            test.done();
        },

        'Verify that all parameters are applied': function(test) {
            var mock = new Mock();
            var allowCORS = controllerUtils.allowCORS({
                allowHeaders: 'foo',
                allowMethods: 'bar',
                allowOrigin: '42',
                exposeHeaders: 'alalao'
            });

            allowCORS(mock.req, mock.res, mock.next);

            test.equal(mock.res.headerWasCalledWith.length, 4);
            test.deepEqual(mock.res.headerWasCalledWith[0], {
                header: 'Access-Control-Allow-Origin',
                value: '42'
            });
            test.deepEqual(mock.res.headerWasCalledWith[1], {
                header: 'Access-Control-Allow-Methods',
                value: 'bar'
            });
            test.deepEqual(mock.res.headerWasCalledWith[2], {
                header: 'Access-Control-Allow-Headers',
                value: 'foo'
            });
            test.deepEqual(mock.res.headerWasCalledWith[3], {
                header: 'Access-Control-Expose-Headers',
                value: 'alalao'
            });
            test.ok(mock.nextWasCalled);
            test.done();
        },

        'Verify that passing maxAge sets Access-Control-Max-Age': function(test) {
            var mock = new Mock();
            var allowCORS = controllerUtils.allowCORS({
                allowHeaders: 'foo',
                allowMethods: 'bar',
                allowOrigin: '42',
                exposeHeaders: 'alalao',
                maxAge: 123
            });

            allowCORS(mock.req, mock.res, mock.next);

            test.equal(mock.res.headerWasCalledWith.length, 5);
            test.deepEqual(mock.res.headerWasCalledWith[0], {
                header: 'Access-Control-Allow-Origin',
                value: '42'
            });
            test.deepEqual(mock.res.headerWasCalledWith[1], {
                header: 'Access-Control-Allow-Methods',
                value: 'bar'
            });
            test.deepEqual(mock.res.headerWasCalledWith[2], {
                header: 'Access-Control-Allow-Headers',
                value: 'foo'
            });
            test.deepEqual(mock.res.headerWasCalledWith[3], {
                header: 'Access-Control-Expose-Headers',
                value: 'alalao'
            });
            test.deepEqual(mock.res.headerWasCalledWith[4], {
                header: 'Access-Control-Max-Age',
                value: 123
            });
            test.ok(mock.nextWasCalled);
            test.done();
        },

        'Can pass an asynchronous function to determine allowed origins': function (test) {
            var mock = new Mock({ host: 'localhost:8001' }, function () {
                test.equal(mock.res.headerWasCalledWith.length, 4);

                test.deepEqual(mock.res.headerWasCalledWith[0], {
                    header: 'Access-Control-Allow-Origin',
                    value: 'localhost:8001'
                });

                test.deepEqual(mock.res.headerWasCalledWith[1], {
                    header: 'Access-Control-Allow-Methods',
                    value: 'GET,PUT,POST,DELETE,HEAD,OPTIONS'
                });

                test.deepEqual(mock.res.headerWasCalledWith[2], {
                    header: 'Access-Control-Allow-Headers',
                    value: 'Content-Type, Authorization, Content-Length, X-Requested-With'
                });

                test.deepEqual(mock.res.headerWasCalledWith[3], {
                    header: 'Access-Control-Expose-Headers',
                    value: ''
                });

                test.ok(mock.nextWasCalled);
                test.done();
            });

            function isAllowedOrigin (req, cb) {
              setImmediate(function () {
                if (req.headers.host === 'localhost:8001') {
                  return cb(null, 'localhost:8001')
                }

                return cb(null, 'naoAutorizado')
              })
            }

            var allowCORS = controllerUtils.allowCORS(undefined, isAllowedOrigin);
            allowCORS(mock.req, mock.res, mock.next);
        },

        'If error is passed to from `isAllowedOrigin` then error is passed to next': function (test) {
            var mock = new Mock({ host: 'www.this-is-a-test.com' }, function (err) {
                test.ok(mock.nextWasCalled);
                test.equal(err.message, 'Não autorizado');
                test.done();
            });

            function isAllowedOrigin (req, cb) {
              setImmediate(function () {
                if (req.headers.host === 'localhost:8001') {
                  return cb(null, 'localhost:8001')
                }

                return cb(new Error('Não autorizado'))
              })
            }

            var allowCORS = controllerUtils.allowCORS(undefined, isAllowedOrigin);
            allowCORS(mock.req, mock.res, mock.next);
        }
    }
};
