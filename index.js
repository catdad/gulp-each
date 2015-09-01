/* jshint node: true */

var path = require('path');
var es = require('event-stream');

function each(iterator, context) {
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
                iteratorFunc(data, file, cb);
            }));
        } else if (file.isBuffer()) {
            content = file.contents.toString('utf8');
            iteratorFunc(content, file, cb);
        } else {
            // not sure what else it could be, but just deal with it
            callback(null, file);
        }
    };
    
    return es.map(doEach);
}

module.exports = each;
