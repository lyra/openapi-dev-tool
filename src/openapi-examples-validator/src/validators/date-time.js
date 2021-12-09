// eslint-disable-next-line max-len
const REGEX_DATE_TIME = '^(?<date>-?(?:[1-9]\d{3}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[1-9]\d(?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00)-02-29))(?:[Tt])(?<time>(?:[01]\d|2[0-3]):[0-5]\d:(?:[0-5]\d|60)(?:\.[0-9]+)?)(?<timezone>[Zz]|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])$';
const dateTimeRegex = new RegExp(REGEX_DATE_TIME);

module.exports = {
    validate
};

function validate(dateTimeString) {
    return dateTimeRegex.test(dateTimeString)
};