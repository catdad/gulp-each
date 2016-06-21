/* jshint node: true */

var path = require('path');
var es = require('event-stream');

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
    
    var doEach = function(file, callback) {
        // continue if the file is null
        if (file.isNull()) {
            return callback(null, file);
        }
        
        var filepath = file.path || file.history[0];
        var name = path.basename(filepath);
        
        var iteratorFunc = context ? iterator.bind(context) : iterator;
        var content;
        
        var cb = function iteratorCallback(err, newContent) {
            if (file.isStream()) {
                file.contents = es.readArray([newContent]);
                callback(null, file);
            } else {
                file.contents = new Buffer(newContent);
                callback(null, file);
            }
        };
        
        if (file.isStream()) {
            file.contents.pipe(es.wait(function(err, data) {
                data = castData(data, enc);
                iteratorFunc(data, file, cb);
            }));
        } else if (file.isBuffer()) {
            content = castData(file.contents, enc);
            iteratorFunc(content, file, cb);
        } else {
            // not sure what else it could be, but just deal with it
            callback(null, file);
        }
    };
    
    return es.map(doEach);
}

module.exports = each;
