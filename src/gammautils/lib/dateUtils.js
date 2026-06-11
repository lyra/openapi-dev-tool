'use strict';

module.exports.__name = 'Date';

module.exports.unixTime = function(date, onlyDate) {
    if(typeof date === 'undefined') {
        date = new Date();
    }

    if(typeof onlyDate === 'undefined') {
        onlyDate = false;
    }

    if(onlyDate) {
        return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    } else {
        return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    }
};

module.exports.isValidDate = function(date) {
    //http://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
    if(Object.prototype.toString.call(date) !== '[object Date]') {
        return false;
    }

    return !isNaN(date.getTime());
};
