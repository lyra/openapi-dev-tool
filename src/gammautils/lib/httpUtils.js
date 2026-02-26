'use strict';

module.exports.__name = 'Http';

module.exports.methods = [
    'get',
    'post',
    'put',
    'head',
    'delete',
    'options',
    'trace',
    'copy',
    'lock',
    'mkcol',
    'move',
    'propfind',
    'proppatch',
    'unlock',
    'report',
    'mkactivity',
    'checkout',
    'merge',
    'm-search',
    'notify',
    'subscribe',
    'unsubscribe',
    'patch',
    'search'
];

module.exports.statuses = {
    //1xx
    'continue': 100,
    100: 'Continue',

    switchingProtocols: 101,
    101: 'Switching Protocols',

    //2xx
    success: 200,
    200: 'Success',

    created: 201,
    201: 'Created',

    accepted: 202,
    202: 'Accepted',

    nonAuthoritativeInformation: 203,
    203: 'Non-Authoritative Information',

    noContent: 204,
    204: 'No Content',

    resetContent: 205,
    205: 'Reset Content',

    partialContent: 206,
    206: 'Partial Content',

    multiStatus: 207,
    207: 'Multi-Status',

    //3xx
    multipleChoices: 300,
    300: 'Multiple Choices',

    movedPermanently: 301,
    301: 'Moved Permanently',

    found: 302,
    302: 'Found',

    seeOther: 303,
    303: 'See Other',

    notModified: 304,
    304: 'Not Modified',

    useProxy: 305,
    305: 'Use Proxy',

    unused: 306,
    306: 'Unused',

    temporaryRedirect: 307,
    307: 'Temporary Redirect',

    //4xx
    badRequest: 400,
    400: 'Bad Request',

    unauthorized: 401,
    401: 'Unauthorized',

    paymentRequired: 402,
    402: 'Payment Required',

    forbidden: 403,
    403: 'Forbidden',

    notFound: 404,
    404: 'Not Found',

    methodNotAllowed: 405,
    405: 'Method Not Allowed',

    notAcceptable: 406,
    406: 'Not Acceptable',

    proxyAuthenticationRequired: 407,
    407: 'Proxy Authentication Required',

    requestTimeout: 408,
    408: 'Request Timeout',

    conflict: 409,
    409: 'Conflict',

    gone: 410,
    410: 'Gone',

    lengthRequired: 411,
    411: 'Length Required',

    preconditionFailed: 412,
    412: 'Precondition Failed',

    requestEntityTooLarge: 413,
    413: 'Request Entity Too Large',

    requestURITooLong: 414,
    414: 'Request-URI Too Long',

    unsupportedMediaType: 415,
    415: 'Unsupported Media Type',

    requestedRangeNotSatisfiable: 416,
    416: 'Requested Range Not Satisfiable',

    expectationFailed: 417,
    417: 'Expectation Failed',

    //5xx
    internalServerError: 500,
    500: 'Internal Server Error',

    notImplemented: 501,
    501: 'Not Implemented',

    badGateway: 502,
    502: 'Bad Gateway',

    serviceUnavailable: 503,
    503: 'Service Unavailable',

    gatewayTimeout: 504,
    504: 'Gateway Timeout',

    httpVersionNotSupported: 505,
    505: 'HTTP Version Not Supported'
};