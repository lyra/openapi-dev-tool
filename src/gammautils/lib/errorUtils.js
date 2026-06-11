/* jshint ignore:start */

var httpUtils = require('./httpUtils');
var stringUtils = require('./stringUtils');
var util = require('util');

module.exports.__name = 'Error';

function HttpClientError(messageToClient, statusCode, data) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);

    if(typeof messageToClient === 'number') {
      if(typeof statusCode === 'object') {
        data = statusCode
      }

      statusCode = messageToClient
      messageToClient = ''
    }

    if(typeof statusCode === 'undefined') {
        statusCode = 400;
    } else if(isNaN(parseInt(statusCode, 10))) {
        data = statusCode;
        statusCode = 400;
    }

    if(typeof statusCode !== 'number' || statusCode < 400 || statusCode >= 500) {
        throw new Error('Status code should be a number between 400 and 499');
    }

    this.messageToClient = messageToClient || '';
    this.statusCode = statusCode;
    this.data = data || {};
    this.message = httpUtils.statuses[statusCode];
    this.name = 'HttpClientError';
}

HttpClientError.prototype.__proto__ = Error.prototype;

module.exports.HttpClientError = HttpClientError;

Object.keys(httpUtils.statuses).forEach(function (error) {
    'use strict';

    if(!isNaN(parseInt(error, 10))) {
        return;
    }

    var errorCode = httpUtils.statuses[error];
    if(errorCode < 400 || errorCode >= 500) {
      return;
    }

    var className = stringUtils.capitalize(error) + 'Error';
    function ErrorClass (messageToClient, data) {
        HttpClientError.call(this, messageToClient, errorCode, data);
    }

    util.inherits(ErrorClass, HttpClientError);
    module.exports[className] = ErrorClass
});
/* jshint ignore:end */
