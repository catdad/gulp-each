/* jshint node: true */
/* global describe, it, beforeEach */

var mocha = require('mocha');
var chai = require('chai');
var expect = chai.expect;

var File = require('vinyl');
var es = require('event-stream');

var fakeData = 'llama';

describe('Buffers', function() {
    var each, input;
    
    beforeEach(function() {
        each = require('./index.js');
        input = function() {
            return new File({
                contents: new Buffer(fakeData), //es.readArray([fakeData]),
                path: 'file.ext',
                base: __dirname
            });
        };
    });
    
    it('gets called once per file', function(done) {
        var count = 0;
        
        var source = each(function(content, file, cb) {
            count++;
            cb(null, content);
        });
        
        source.on('end', done);
        
        source.write(input());
        
        expect(count).to.equal(1);
        
        source.write(input());
        
        expect(count).to.equal(2);
        
        source.end();
    });
    
    it('takes a buffer as a source', function(done) {
        var source = each(function(content, file, cb) {
            expect(content).to.equal(fakeData);
            cb(null, content);
            
            done();
        });
        
        source.write(input());
        source.end();
    });
});

describe('Streams', function() {
    
});
