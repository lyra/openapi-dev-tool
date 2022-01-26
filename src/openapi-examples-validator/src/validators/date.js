// eslint-disable-next-line max-len
const REGEX_DATE = '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$';

const dateRegex = new RegExp(REGEX_DATE);

module.exports = {
    validate
};

function validate(dateString) {
    return dateRegex.test(dateString)
};