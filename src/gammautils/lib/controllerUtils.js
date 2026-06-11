'use strict';

module.exports.__name = 'Controller';
module.exports.__description = 'Utilities for the express framework';

var path = require('path');

module.exports.acceptJson = function(req, res, next) {
    req.headers.accept = 'application/json';
    res.lean = true;

    next();
};

module.exports.acceptXml = function(req, res, next) {
    req.headers.accept = 'application/xml';
    res.lean = true;

    next();
};

module.exports.acceptCsv = function(req, res, next) {
    req.headers.accept = 'text/csv';
    res.lean = true;

    next();
};

var corsDefaults = {
    allowOrigin: '*',
    allowMethods: 'GET,PUT,POST,DELETE,HEAD,OPTIONS',
    allowHeaders: 'Content-Type, Authorization, Content-Length, X-Requested-With',
    exposeHeaders: ''
};

module.exports.allowCORS = function(params, isAllowedOrigin) {
    if(typeof params === 'undefined') {
        params = corsDefaults;
    }

    if (!isAllowedOrigin) {
        isAllowedOrigin = function (host, cb) {
            cb(null, params.allowOrigin || corsDefaults.allowOrigin);
        };
    }

    return function(req, res, next) {
        isAllowedOrigin(req, function (err, allowedOrigin) {
            if (err) {
                return next(err);
            }

            res.header('Access-Control-Allow-Origin', allowedOrigin);
            res.header('Access-Control-Allow-Methods', params.allowMethods || corsDefaults.allowMethods);
            res.header('Access-Control-Allow-Headers', params.allowHeaders || corsDefaults.allowHeaders);
            res.header('Access-Control-Expose-Headers', params.exposeHeaders || corsDefaults.exposeHeaders);

            if(params.maxAge) {
                res.header('Access-Control-Max-Age', params.maxAge);
            }

            if ('OPTIONS' === req.method) {
                return res.status(200).end();
            }

            next();
        });
    };
};

module.exports.loadAction = function(name, options) {
    return require(path.join(__dirname, './actions/' + name + 'Action'))(options);
};
