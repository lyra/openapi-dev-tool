// eslint-disable-next-line max-len
const REGEX_IPV4 = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/gm;

module.exports = {
    validate
};

function validate(ipv4String) {
    return REGEX_IPV4.test(ipv4String)
};