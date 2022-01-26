// eslint-disable-next-line max-len
const REGEX_URI = '^((cc:|https:|http:|[/][/]|www.)([a-z]|[A-Z]|[:0-9]|[/.])*)$';

const uriRegex = new RegExp(REGEX_URI);

module.exports = {
    validate
};

function validate(uriString) {
    return uriRegex.test(uriString)
};