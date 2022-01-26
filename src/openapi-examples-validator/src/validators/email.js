// eslint-disable-next-line max-len
const REGEX_EMAIL = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';

const emailRegex = new RegExp(REGEX_EMAIL);

module.exports = {
    validate
};

function validate(emailString) {
    return emailRegex.test(emailString)
};