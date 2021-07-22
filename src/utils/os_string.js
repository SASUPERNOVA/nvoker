const forbiddenChars = {
    '<': '%3C',
    '>': '%3E',
    ':': '%3A',
    '"': '%22',
    '/': '%2F',
    '\\': '%5C',
    '|': '%7C',
    '?': '%3F',
    '*': '%2A'
}

function encodeOSString(osString) {
    for ([key, val] of Object.entries(forbiddenChars)) {
        osString = osString.replaceAll(key, val);
    }

    return osString;
}

function decodeOSString(osString) {
    for ([key, val] of Object.entries(forbiddenChars)) {
        osString = osString.replaceAll(val, key);
    }

    return osString;
}

if (typeof module !== 'undefined') {
    module.exports = {
        encodeOSString,
        decodeOSString
    }
}