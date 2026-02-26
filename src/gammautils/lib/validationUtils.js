'use strict';

var objectUtils = require('./objectUtils'),
    validEmailRegExp = (/^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/),
    validFormattedEmailAddressRegExp = (/^(.+)\s<([A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?)>$/),
    validEmailRegExpForJade = '^[A-Za-z0-9_\\-\\.]+@[A-Za-z0-9_\\-\\.]{2,}\\.[A-Za-z0-9]{2,}(\\.[A-Za-z0-9])?';

module.exports.__name = 'Validation';

module.exports.validEmailRegExp = validEmailRegExp;
module.exports.validFormattedEmailAddressRegExp = validFormattedEmailAddressRegExp;
module.exports.validEmailRegExpForJade = validEmailRegExpForJade;

/*module.exports.isStrongPassword = function(string) {
    //pelo menos um maiusculo
    //contem numeros
    //contem caracteres especiais
    //pelo menos 8 caracteres

    return (/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/).test(string);
};*/

module.exports.isValidEmail = function(email) {
    return validEmailRegExp.test(email);
};

module.exports.isNumericString = function(text){
    return (/^[0-9]+$/).test(text);
};

function isValidLatitude(latitude) {
    latitude = parseFloat(latitude, 10);

    return !isNaN(latitude) && latitude >= -90 && latitude <= 90;
}

module.exports.isValidLatitude = isValidLatitude;

function isValidLongitude(longitude) {
    longitude = parseFloat(longitude, 10);

    return !isNaN(longitude) && longitude >= -180 && longitude <= 180;
}

module.exports.isValidLongitude = isValidLongitude;

module.exports.areValidGeoCoordinates = function(latitude, longitude) {
    if(typeof latitude === 'object') {
        longitude = objectUtils.isUndefined(latitude.longitude) ? latitude.lng : latitude.longitude;
        latitude = objectUtils.isUndefined(latitude.latitude) ? latitude.lat : latitude.latitude;
    }

    return isValidLatitude(latitude) && isValidLongitude(longitude);
};