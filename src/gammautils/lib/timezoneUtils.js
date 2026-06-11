'use strict';

var africa = require('./timezones/africa.json').Africa,
    america = require('./timezones/america.json').America,
    antarctica = require('./timezones/antarctica.json').Antarctica,
    artic = require('./timezones/artic.json').Artic,
    asia = require('./timezones/asia.json').Asia,
    atlantic = require('./timezones/atlantic.json').Atlantic,
    australia = require('./timezones/australia.json').Australia,
    europe = require('./timezones/europe.json').Europe,
    generic = require('./timezones/generic.json').Generic,
    indian = require('./timezones/indian.json').Indian,
    pacific = require('./timezones/pacific.json').Pacific;

module.exports.__name = 'Timezone';

module.exports.africa = africa;
module.exports.america = america;
module.exports.antarctica = antarctica;
module.exports.artic = artic;
module.exports.asia = asia;
module.exports.atlantic = atlantic;
module.exports.australia = australia;
module.exports.europe = europe;
module.exports.generic = generic;
module.exports.indian = indian;
module.exports.pacific = pacific;

module.exports.all = {
    africa: africa,
    america: america,
    antarctica: antarctica,
    artic: artic,
    asia: asia,
    atlantic: atlantic,
    australia: australia,
    europe: europe,
    generic: generic,
    indian: indian,
    pacific: pacific,
};