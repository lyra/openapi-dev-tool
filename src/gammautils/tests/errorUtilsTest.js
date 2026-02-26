'use strict';

var //util = require('util'),
    errorUtils = require('../lib/errorUtils');

module.exports = {
    '__name': { '': function(test) { test.done(); } },
    '__description': { '': function(test) { test.done(); } },
    'HttpClientError': {
        'Check that object is error': function(test) {
            var error = new errorUtils.HttpClientError();
            test.ok(error instanceof Error)
            test.done();
        },

        'Has proper error name': function(test) {
            var error = new errorUtils.HttpClientError();
            test.equals(error.name, 'HttpClientError');
            test.done();
        },

        'Default error is 400 (bad request)': function(test) {
            var error = new errorUtils.HttpClientError();
            test.equals(error.statusCode, 400);
            test.equals(error.messageToClient, '');
            test.equals(error.message, 'Bad Request');
            test.done();
        },

        'Provides no default message': function(test) {
            var error = new errorUtils.HttpClientError();
            test.equals(error.messageToClient, '');
            test.equals(error.message, 'Bad Request');
            test.done();
        },

        'Can specify custom error message keeping default status code of 400 ': function(test) {
            var error = new errorUtils.HttpClientError('Validation error');
            test.equals(error.message, 'Bad Request');
            test.equals(error.messageToClient, 'Validation error');
            test.equals(error.statusCode, 400);

            test.done();
        },

        'Can specify custom error message and custom status code': function(test) {
            var error = new errorUtils.HttpClientError('You cant go further...', 403);
            test.equals(error.message, 'Forbidden');
            test.equals(error.messageToClient, 'You cant go further...');
            test.equals(error.statusCode, 403);

            test.done();
        },

        'Can pass error number as first parameter': function (test) {
            var error = new errorUtils.HttpClientError(413);
            test.equals(error.statusCode, 413);
            test.equals(error.messageToClient, '');
            test.equals(error.message, 'Request Entity Too Large');
            test.done();
        },

        'Can pass error number as first parameter and data as second': function (test) {
            var data = { details: 'a lot' };
            var error = new errorUtils.HttpClientError(403, data);

            test.equals(error.statusCode, 403);
            test.deepEqual(error.data, data);
            test.equals(error.messageToClient, '');
            test.equals(error.message, 'Forbidden');
            test.done();
        }
    },

    'BadRequestError': {
      'Can instantiate and proper parameters are pre set': function (test) {
        var error = new errorUtils.BadRequestError('test');
        test.equals(error.name, 'HttpClientError');
        test.equals(error.statusCode, 400);
        test.equals(error.messageToClient, 'test');
        test.equals(error.message, 'Bad Request');
        test.done();
      }
    },

    'UnauthorizedError': {
      'Can instantiate and proper parameters are pre set': function (test) {
        var error = new errorUtils.UnauthorizedError('test');
        test.equals(error.name, 'HttpClientError');
        test.equals(error.statusCode, 401);
        test.equals(error.messageToClient, 'test');
        test.equals(error.message, 'Unauthorized');
        test.done();
      }
    },

    'PaymentRequiredError': {
      'Can instantiate and proper parameters are pre set': function (test) {
        var error = new errorUtils.PaymentRequiredError('test');
        test.equals(error.name, 'HttpClientError');
        test.equals(error.statusCode, 402);
        test.equals(error.messageToClient, 'test');
        test.equals(error.message, 'Payment Required');
        test.done();
      }
    },

    'ForbiddenError': {
      'Can instantiate and proper parameters are pre set': function (test) {
        var error = new errorUtils.ForbiddenError('test');
        test.equals(error.name, 'HttpClientError');
        test.equals(error.statusCode, 403);
        test.equals(error.messageToClient, 'test');
        test.equals(error.message, 'Forbidden');
        test.done();
      }
    },

    'NotFoundError': {
      'Can instantiate and proper parameters are pre set': function (test) {
        var error = new errorUtils.NotFoundError('test');
        test.equals(error.name, 'HttpClientError');
        test.equals(error.statusCode, 404);
        test.equals(error.messageToClient, 'test');
        test.equals(error.message, 'Not Found');
        test.done();
      }
    },

    'MethodNotAllowedError': {
      'Can instantiate and proper parameters are pre set': function (test) {
        var error = new errorUtils.MethodNotAllowedError('test');
        test.equals(error.name, 'HttpClientError');
        test.equals(error.statusCode, 405);
        test.equals(error.messageToClient, 'test');
        test.equals(error.message, 'Method Not Allowed');
        test.done();
      }
    },

    'NotAcceptableError': {
      'Can instantiate and proper parameters are pre set': function (test) {
        var error = new errorUtils.NotAcceptableError('test');
        test.equals(error.name, 'HttpClientError');
        test.equals(error.statusCode, 406);
        test.equals(error.messageToClient, 'test');
        test.equals(error.message, 'Not Acceptable');
        test.done();
      }
    },

    'ProxyAuthenticationRequiredError': {
      'Can instantiate and proper parameters are pre set': function (test) {
        var error = new errorUtils.ProxyAuthenticationRequiredError('test');
        test.equals(error.name, 'HttpClientError');
        test.equals(error.statusCode, 407);
        test.equals(error.messageToClient, 'test');
        test.equals(error.message, 'Proxy Authentication Required');
        test.done();
      }
    },

    'RequestTimeoutError': {
      'Can instantiate and proper parameters are pre set': function (test) {
        var error = new errorUtils.RequestTimeoutError('test');
        test.equals(error.name, 'HttpClientError');
        test.equals(error.statusCode, 408);
        test.equals(error.messageToClient, 'test');
        test.equals(error.message, 'Request Timeout');
        test.done();
      }
    },

    'ConflictError': {
      'Can instantiate and proper parameters are pre set': function (test) {
        var error = new errorUtils.ConflictError('test');
        test.equals(error.name, 'HttpClientError');
        test.equals(error.statusCode, 409);
        test.equals(error.messageToClient, 'test');
        test.equals(error.message, 'Conflict');
        test.done();
      }
    },

    'GoneError': {
      'Can instantiate and proper parameters are pre set': function (test) {
        var error = new errorUtils.GoneError('test');
        test.equals(error.name, 'HttpClientError');
        test.equals(error.statusCode, 410);
        test.equals(error.messageToClient, 'test');
        test.equals(error.message, 'Gone');
        test.done();
      }
    },

    'LengthRequiredError': {
      'Can instantiate and proper parameters are pre set': function (test) {
        var error = new errorUtils.LengthRequiredError('test');
        test.equals(error.name, 'HttpClientError');
        test.equals(error.statusCode, 411);
        test.equals(error.messageToClient, 'test');
        test.equals(error.message, 'Length Required');
        test.done();
      }
    },

    'PreconditionFailedError': {
      'Can instantiate and proper parameters are pre set': function (test) {
        var error = new errorUtils.PreconditionFailedError('test');
        test.equals(error.name, 'HttpClientError');
        test.equals(error.statusCode, 412);
        test.equals(error.messageToClient, 'test');
        test.equals(error.message, 'Precondition Failed');
        test.done();
      }
    },

    'RequestEntityTooLargeError': {
      'Can instantiate and proper parameters are pre set': function (test) {
        var error = new errorUtils.RequestEntityTooLargeError('test');
        test.equals(error.name, 'HttpClientError');
        test.equals(error.statusCode, 413);
        test.equals(error.messageToClient, 'test');
        test.equals(error.message, 'Request Entity Too Large');
        test.done();
      }
    },

    'RequestURITooLongError': {
      'Can instantiate and proper parameters are pre set': function (test) {
        var error = new errorUtils.RequestURITooLongError('test');
        test.equals(error.name, 'HttpClientError');
        test.equals(error.statusCode, 414);
        test.equals(error.messageToClient, 'test');
        test.equals(error.message, 'Request-URI Too Long');
        test.done();
      }
    },

    'UnsupportedMediaTypeError': {
      'Can instantiate and proper parameters are pre set': function (test) {
        var error = new errorUtils.UnsupportedMediaTypeError('test');
        test.equals(error.name, 'HttpClientError');
        test.equals(error.statusCode, 415);
        test.equals(error.messageToClient, 'test');
        test.equals(error.message, 'Unsupported Media Type');
        test.done();
      }
    },

    'RequestedRangeNotSatisfiableError': {
      'Can instantiate and proper parameters are pre set': function (test) {
        var error = new errorUtils.RequestedRangeNotSatisfiableError('test');
        test.equals(error.name, 'HttpClientError');
        test.equals(error.statusCode, 416);
        test.equals(error.messageToClient, 'test');
        test.equals(error.message, 'Requested Range Not Satisfiable');
        test.done();
      }
    },

    'ExpectationFailedError': {
      'Can instantiate and proper parameters are pre set': function (test) {
        var error = new errorUtils.ExpectationFailedError('test');
        test.equals(error.name, 'HttpClientError');
        test.equals(error.statusCode, 417);
        test.equals(error.messageToClient, 'test');
        test.equals(error.message, 'Expectation Failed');
        test.done();
      }
    }
};