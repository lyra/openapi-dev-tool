'use strict';

var accentMap = require('./accentMap'),
    numberUtils = require('./numberUtils'),
    objectUtils = require('./objectUtils'),
    validationUtils = require('./validationUtils'),
    net = require('net');

module.exports.__name = 'String';

//Add .chunks(size);
//"1234567890".match(/.{1,2}/g);
// >>> ["12", "34", "56", "78", "9"]
//http://stackoverflow.com/questions/7033639/javascript-split-large-string-in-n-size-chunks

//function splitCsvLine(line, delimiter, properties) {
//    if(typeof delimiter === 'undefined') {
//        delimiter = ';';
//    }
//
//    if(Array.isArray(delimiter)) {
//        propeties = delimiter;
//        delimiter = ";";
//    }

    //a ideia deste método é receber uma linha CSV
    //
    //      splitCsvLine("Renato;26;Azul", ";", ["nome", "idade:number", "corPreferida"]
    //ou    splitCsvLine("Renato;26;Azul", ["nome", "idade:number", "corPreferida"]
    //
    //  talvez chamar de splitCommaSeparatedValues
    //
    //E retornar um objeto assim
    //    {
    //        nome: "Renato",
    //        idade: 26,
    //        corPreferida: "Azul"
    //    }
    //
    // Se não informar um schema, retorna assim:
    //
    //[
    //    "Renato",
    //    "26",
    //    "Azul"
    //]
//}

//similar a ideia acima, devo criar algo para extrair posicionalmente, por exemplo:

//
//
//  splitPositionalValues('00001GAMMASOFT 1', [
//      { length: 5, type: 'number', property: 'id' },
//      { length: 9, type: 'string', trim: true, property: 'name' }, //string pode ser o default
//      { length: 1, type: 'boolean', property: 'isAwesome' }
//  ]);
//
//  e retorna um objecto assim:
//
//      { id: 1, name: 'GAMMASOFT', isAwesome: true }
//
//

/*
function indexesOf(text, term, comparator) {

    var comparators = {
        default: function(a, b) {
            return a === b;
        },
        search: function(a, b) {
            return getSearchString(a) === getSearchString(b);
        }
    },
    indexes = [];

    if(typeof comparator === 'undefined') {
        comparator = comparators['default'];
    } else if(typeof comparator === 'string') {
        comparator = comparators[comparator];
    }

    if(comparator(text, term)) {
        indexes.push(0);
    }

    for (var i = 0; i < text.length - term.length; i++) {
        if(comparator(text.split('').splice(i, term.length).join(''), term)) {
            indexes.push(i);
        }
    }

    return indexes;
}
module.exports.indexesOf = indexesOf;

function replaceIndexes(indexes, text, length, transform) {
    if(indexes.length === 0) {
        return text;
    }

    if(typeof transform === 'undefined') {
        transform = function(string) {
            return string;
        };
    }

    var parts = [substring(text, 0, indexes[0])];

    for (var i = 0; i < indexes.length; i++) {
        var index = indexes[i];

        if(indexes.length - 1 === i) {
            if(indexes.length === 1) {
                parts.push(transform(text.substr(index, length)));
                index += length;
            }

            parts.push(text.substring(index, text.length));
        } else {
            parts.push(transform(text.substr(index, length)));
            parts.push(text.substring(index + length, indexes[i + 1]));
        }
    }

    return parts.join('');
}
module.exports.replaceIndexes = replaceIndexes;


function managePlurals(valor, mensagens) { //mover para o gammautils.string
    var mensagem = mensagens[valor];

    if(!mensagem && valor > 1) {
        mensagem = mensagens['n'];
    }

    return (mensagem || '').replace('%s', valor);
}
module.exports.managePlurals = managePlurals;*/

function removeNewLines(text, newLineReplacer) {
    if(typeof text === 'undefined') {
        return text;
    }

    if(typeof newLineReplacer !== 'string') {
        newLineReplacer = ' ';
    }

    return text.toString().replace(/\r?\n|\r/g, newLineReplacer);
}
module.exports.removeNewLines = removeNewLines;

function removeExtraSpaces(text) {
    if(typeof text === 'undefined') {
        return text;
    }

    return text
                .toString()
                .replace(/\s\s+/g, ' ')
                .replace(/\r?\n|\r/g, ' ')
                .trim();
}
module.exports.removeExtraSpaces = removeExtraSpaces;

function insert(string, index, value) {
    return [
        string.substring(0, index),
        value,
        string.substring(index, string.length)
    ].join('');
}
module.exports.insert = insert;

function reduceWhiteSpaces(string) {
    if(typeof string !== 'string') {
        return string;
    }

    return string.replace(/[\s]{2,}/g, ' ').trim();
}
module.exports.reduceWhiteSpaces = reduceWhiteSpaces;

function count(string, regexp) {
    if(typeof regexp === 'string') {
        regexp = new RegExp(regexp, 'g');
    }

    return (string.match(regexp) || []).length;
}
module.exports.count = count;

function capitalize(value) {
    if(typeof value !== 'string') {
        return value;
    }

    return value.substr(0, 1).toUpperCase() + value.substr(1);
}
module.exports.capitalize = capitalize;

function decapitalize(value) {
    if(typeof value !== 'string') {
        return value;
    }

    return value.substr(0, 1).toLowerCase() + value.substr(1);
}
module.exports.decapitalize = decapitalize;

function camelCaseJoin(a, b) {
    if(!a) {
        return b;
    }

    return decapitalize(a) + capitalize(b);
}
module.exports.camelCaseJoin = camelCaseJoin;

// function dotJoin(a, b) {
//     return a + '.' + decapitalize(b);
// }
// module.exports.dotJoin = dotJoin;

function Record(value, actualIndex) {
    var _label = '';

    this.labeled = function(label) {
        _label = label;
    };

    this.label = function() {
        return _label;
    };

    this.toString = function() {
        return value;
    };

    this.at = function(index) {
        if(actualIndex !== index) {
            throw new Error([
                'Actual index was:',
                actualIndex,
                ', expected was:',
                index
            ].join(' '));
        }
    };
}

function Line(maxSize, parsers) {
    var _parsers = {},
        records = [],
        currentSize = 0;

    if(typeof maxSize === 'object') {
        parsers = maxSize;
        maxSize = undefined;
    }

    if(objectUtils.isUndefined(maxSize)) {
        maxSize = Number.MAX_VALUE;
    }

    if(objectUtils.isUndefined(parsers)) {
        parsers = {
            value: function(value) {
                return value;
            }
        };
    }

    objectUtils.forEachOwnProperty(parsers, function(name, fn) {
        _parsers[name] = function() {
            var value = fn.apply(this, arguments),
                currentIndex = currentSize;

            if(currentSize + value.length > maxSize) {
                throw new Error('Size limit of ' + maxSize + ' exceeded');
            }

            currentSize += value.length;

            var record = new Record(value, currentIndex);
            records.push(record);

            return record;
        };
    });

    this.add = _parsers;

    this.toString = function(separator, exportLabels, options) {
        if(objectUtils.isUndefined(exportLabels)) {
            exportLabels = false;
        }

        if(objectUtils.isUndefined(options)) {
            options = {
                strictSize: false
            };
        }

        separator = separator || '';

        var labels = '';

        if(exportLabels) {
            labels = records.map(function(record) {
                return record.label();
            }).join(separator) + '\n';
        }

        var recordsString = records.join(separator);

        if(options.strictSize && recordsString.length !== maxSize) {
            throw new Error([
                'Strict size mode is enabled and size was',
                recordsString.length,
                'instead of ',
                maxSize
            ].join(' '));
        }

        return labels + recordsString;
    };
}
module.exports.Line = Line;

function truncate(string, length){
    if (string === null) {
        return '';
    }

    string = String(string);
    length = parseInt(length, 10);

    return string.length > length ? string.slice(0, length) : string;
}
module.exports.truncate = truncate;

function parseFormattedEmailAddress(email) {
    if(typeof email === 'undefined' || typeof email !== 'string') {
        return email;
    }

    var data = email.match(validationUtils.validFormattedEmailAddressRegExp);
    if(data) {
        return {
            name: data[1],
            email: data[2]
        };
    } else {
        return email;
    }
}
module.exports.parseFormattedEmailAddress = parseFormattedEmailAddress;

function generateGuid(separators){
    /* jshint ignore:start, unused:false */
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    /* jshint ignore:end */
}
module.exports.generateGuid = generateGuid;

//this algorithm was taken from underscore.string module all credits to them
function pad(str, length, padStr, type) {
    /* jshint ignore:start, unused:false */
    str = str == null ? '' : String(str);
    length = ~~length;

    var padlen  = 0;

    if (!padStr)
        padStr = ' ';
    else if (padStr.length > 1)
        padStr = padStr.charAt(0);

    switch(type) {
        case 'right':
            padlen = length - str.length;
            return str + strRepeat(padStr, padlen);
        case 'both':
            padlen = length - str.length;
            return strRepeat(padStr, Math.ceil(padlen/2)) + str
                  + strRepeat(padStr, Math.floor(padlen/2));
        default: // 'left'
            padlen = length - str.length;
            return strRepeat(padStr, padlen) + str;
    }

    function strRepeat(str, qty){
        if (qty < 1) return '';
        var result = '';
        while (qty > 0) {
            if (qty & 1) result += str;
                qty >>= 1, str += str;
            }

        return result;
    };
    /* jshint ignore:end */
}
module.exports.pad = pad;

function removeDiacritics(string) {
    if (!string) {
        return '';
    }

    var result = '';
    for (var i = 0; i < string.length; i++) {
        result += accentMap[string.charAt(i)] || string.charAt(i);
    }

    return result;
}
module.exports.removeDiacritics = removeDiacritics;

function dasherize(string) {
    //taken from underscore.string
    if(typeof string === 'undefined' || string === null) {
        return '';
    }

    return string.toString().trim(string).replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
}
module.exports.dasherize = dasherize;

function slugify(string) {
    //taken from underscore.string
    if(typeof string === 'undefined' || string === null) {
        return '';
    }

    //removes diacritics then removes what is not a character nor a whitespace nor a dash
    var slug = removeDiacritics(string).replace(/[^\w\s-]/g, '').toLowerCase();

    return dasherize(slug);
}
module.exports.slugify = slugify;

function getSearchString(string) {
    return removeDiacritics(string)
                .toLowerCase()
                .replace(/[^\w]/g, '');
}
module.exports.getSearchString = getSearchString;

function reverseString(string){
    return string.split('').reverse().join('');
}
module.exports.reverseString = reverseString;

function findPrefix(strings){
    if(strings && strings.length > 0){
        var prefix = '';

        var characters = strings[0].split('');
        for(var i = 0; i < characters.length; i++){
            var isPrefix = true;
            var character = characters[i];

            for(var j = 0; j < strings.length; j++) {
                var string = strings[j];

                isPrefix = isPrefix && (string.length >= i + 1 && string[i] === character);
            }

            if(isPrefix) {
                prefix += character;
            }
            else {
                return prefix;
            }
        }
    }
    else {
        return null;
    }
}
module.exports.findPrefix = findPrefix;

function findSuffix(strings){
    var reversed = [];

    strings.forEach(function(string){
        reversed.push(reverseString(string));
    });

    return reverseString(findPrefix(reversed));
}
module.exports.findSuffix = findSuffix;

function removePrefix(strings){
    var prefix = findPrefix(strings);

    var result = [];
    strings.forEach(function(string){
        result.push(string.replace(prefix, ''));
    });

    return result;
}
module.exports.removePrefix = removePrefix;

function startsWith(str, starts){
    if (starts === '') {
        return true;
    }
    if (str === null || starts === null) {
        return false;
    }
    str = String(str);
    starts = String(starts);

    return str.length >= starts.length && str.slice(0, starts.length) === starts;
}
module.exports.startsWith = startsWith;

function endsWith(str, ends){
    if (ends === '') {
        return true;
    }
    if (str === null || ends === null) {
        return false;
    }
    str = String(str);
    ends = String(ends);

    return str.length >= ends.length && str.slice(str.length - ends.length) === ends;
}
module.exports.endsWith = endsWith;

function joinUrls(a, b){
    if(a === '') {
        return b;
    } else if(b === '') {
        return a;
    } else if(endsWith(a, '/') && startsWith(b, '/')) {
        return a + b.substr(1);
    } else if(endsWith(a, '/') && !startsWith(b, '/')) {
        return a + b;
    } else if(!endsWith(a, '/') && startsWith(b, '/')) {
        return a + b;
    } else if(!endsWith(a, '/') && !startsWith(b, '/')) {
        return a + '/' + b;
    }
}
module.exports.joinUrls = joinUrls;

function getUrlSubpaths(path){
    var result = [];

    path = path.split('/').filter(function(segment){
        return segment !== '';
    });

    path.forEach(function(segment, index){
        if(index === 0) {
            result.push(segment);
        } else {
            result.push(joinUrls(result[index - 1], segment));
        }
    });

    return result;
}
module.exports.getUrlSubpaths = getUrlSubpaths;

function nextSizeType(type){
    if(type === 'b'){
        return 'Kb';
    } else if(type === 'Kb') {
        return 'Mb';
    } else if(type === 'Mb') {
        return 'Gb';
    } else if(type === 'Gb') {
        return 'Tb';
    } else if(type === 'Tb' || type === 'Pb') {
        return 'Pb';
    } else {
        return null;
    }
}
module.exports.nextSizeType = nextSizeType;

function formatFileSize(size, type, precision, decimalSeparator) {
    size = parseFloat(size);

    if(typeof precision === 'undefined') {
        precision = 2;
    }

    if(typeof type === 'undefined') {
        type = 'b';
    }

    if(typeof decimalSeparator === 'undefined') {
        decimalSeparator = '.';
    }

    if(size < 1024 || type === 'Pb') {
        return size.toFixed(precision).replace('.', decimalSeparator) + type;
    } else {
        return formatFileSize(size/1024, nextSizeType(type), precision, decimalSeparator);
    }
}
module.exports.formatFileSize = formatFileSize;

module.exports.parseSequence = function(string, sequenceDescriptor, options){
    var start = 0,
        conversions = {
            number: function(value) {
                return parseFloat(value);
            },
            string: function(value) {
                return value;
            },
            date: function(value) {
                return new Date(value);
            }
        },
        property;

    options = options || {};

    if(typeof options.strictSize === 'number') {
        if(string.length !== options.strictSize) {
            throw new Error('String length must be ' + options.strictSize + ' characters');
        }
    }

    for(property in sequenceDescriptor) {
        if(sequenceDescriptor.hasOwnProperty(property)) {
            var definition = sequenceDescriptor[property],
                converter;

            if(typeof definition.convertTo === 'function') {
                converter = definition.convertTo;
            } else {
                converter = conversions[definition.convertTo || 'string'];
            }

            if(typeof definition !== 'object') {
                definition = {
                    offset: definition
                };
            }

            var length = parseInt(definition.offset, 10);
            sequenceDescriptor[property] = converter(string.substr(start, length));

            if(definition.ignore) {
                delete sequenceDescriptor[property];
            }

            start += length;
        }
    }

    return sequenceDescriptor;
};

module.exports.onlyLettersAndNumbers = function(string, size){
    if(typeof size === 'undefined') {
        size = '+';
    }

    if(['+', '*'].indexOf(size) === -1) {
        size = '{' + size + '}';
    }

    return new RegExp('^[0-9a-zA-Z]' + size + '$').test(string);
};

module.exports.getLink = function(text, options){
    var link = text.link(options.href);

    if(options.title) {
        link = link.replace('href=', 'title="' + options.title + '" href=');
    }

    if(options.target) {
        link = link.replace('href=', 'target="' + options.target + '" href=');
    }

    return link;
};

module.exports.getRandomString = function(length, chars) {
    var result = '';

    if(typeof chars === 'undefined') {
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%ˆ&*()-=+';
    }

    while (length > 0) {
        result += chars[numberUtils.getRandomInteger(0, chars.length - 1)];
        length--;
    }

    return result;
};

module.exports.isIp = function(value){
    var isIp = net.isIP(value);
    return isIp || false;
};

module.exports.shortenName = function(name, level){
    if(name === '') {
        return '';
    }

    if(typeof level === 'undefined') {
        level = 0;
    }

    if(level === 2) {
        var parts = name.split(' '),
            first = parts[0],
            last = parts.pop().trim();

        if(first === '') {
            return '';
        }

        while(typeof last !== 'undefined' && last.length <= 3) {
            last = parts.pop();
        }

        if(last === first || last === '' || typeof last === 'undefined' || last.length <= 3) {
            return first.substr(0, 1) + '.';
        } else {
            return first + ' ' + last.substr(0, 1) + '.';
        }
    }

    if(level === 3) {
        return name.split(' ').map(function(part, index) {
            return part.length > 3 || index === 0 ? part.substr(0, 1).toUpperCase() : '';
        }).join('');
    }

    if(level === 4) {
        return name.substr(0, 1).toUpperCase() + '.';
    }

    var array = name.split(' ');
    return array.map(function(part, i){
        if(i === 0 || i === array.length - 1 || (part.length <= 3 && level === 0)) {
            return part;
        } else if(level === 0) {
            return part.substring(0, 1).toUpperCase() + '.';
        } else {
            return '';
        }
    }).join(' ').replace(/\s{2,}/g, ' ');
};

module.exports.splitWords = function(text){
    return text.split(' ').filter(function(word){
        return word.length > 0;
    });
};
