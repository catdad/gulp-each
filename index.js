/* jshint node: true */

var path = require('path');
var es = require('event-stream');
var readFiles = require('read-vinyl-file-stream');

var encodings = ['utf8', 'utf-8', 'buffer'];
var defaultEnc = 'utf8';

function castData(data, enc) {
    var isBuffer = Buffer.isBuffer(data);

    if (enc === 'buffer') {
        return isBuffer ? data : (new Buffer(data));
    } else {
        return isBuffer ? data.toString(enc) : data;
    }
}

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
