/* jshint node: true */

var path = require('path');

var readFiles = require('read-vinyl-file-stream');

var encodings = ['utf8', 'utf-8', 'buffer'];
var defaultEnc = 'utf8';

function each(iterator, enc, context) {
    if (enc && typeof enc === 'string') {
        enc = encodings.indexOf(enc) > -1 ? enc : defaultEnc;
    } else if (enc !== undefined) {
        context = enc;
        enc = defaultEnc;
    } else {
        enc = defaultEnc;
    }

    var iteratorFunc = context ? iterator.bind(context) : iterator;

    return readFiles(function (content, file, stream, cb) {
        iteratorFunc(content, file, cb);
    }, enc);
}

module.exports = each;
