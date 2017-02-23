/* jshint node: true, expr: true */
/* global describe, it, beforeEach */

var mocha = require('mocha');
var chai = require('chai');
var expect = chai.expect;

var File = require('vinyl');
var es = require('event-stream');
var through = require('through2');

var each = require('./');

var fakeData = 'llama';

function fileBuffer(opts) {
    opts = opts || {};

    return new File({
        contents: new Buffer(opts.content || 'fake file'),
        path: opts.path || Math.random().toString(36).slice(2) + '.txt',
        base: __dirname
    });
}

function inputStream(dataArr) {
    var input = through.obj();

    setImmediate(function () {
        dataArr.forEach(function (file) {
            input.push(file);
        });

        input.end();
    });

    return input;
}

describe('Buffers', function() {
    var input;

    beforeEach(function() {
        input = function() {
            return new fileBuffer({
                content: fakeData,
                path: 'file.ext'
            });
        };
    });

    it('gets called once per file', function(done) {
        var count = 0;

        var source = through.obj();

        source.pipe(each(function(content, file, cb) {
            count++;
            cb(null, content);
        }))
            .on('end', done)
            .on('error', done)
            .on('data', function () {});

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

    it('can output a buffer in the iterator function', function(done) {
        var source = each(function(content, file, cb) {
            expect(content).to.be.instanceOf(Buffer);
            expect(content.toString()).to.equal(fakeData);
            cb(null, content);

            done();
        }, 'buffer');

        source.write(input());
        source.end();
    });
});

describe('Streams', function() {
    var input;

    beforeEach(function() {
        input = function() {
            return new File({
                contents: es.readArray([fakeData]),
                path: 'file.ext',
                base: __dirname
            });
        };
    });

    it('takes a stream as a source', function(done) {
        var source = each(function(content, file, cb) {
            expect(content).to.equal(fakeData);
            cb(null, content);

            done();
        });

        source.write(input());
        source.end();
    });

    it('can output a buffer in the iterator function', function(done) {
        var source = each(function(content, file, cb) {
            expect(content).to.be.instanceOf(Buffer);
            expect(content.toString()).to.equal(fakeData);
            cb(null, content);

            done();
        }, 'buffer');

        source.write(input());
        source.end();
    });
});

describe('general', function() {
    var input, obj = {};

    beforeEach(function() {
        input = function() {
            return new fileBuffer({
                content: fakeData,
                path: 'file.ext'
            });
        };
    });

    it('can be called with a `this` arguments', function(done) {
        var source = each(function(content, file, cb) {
            expect(this).to.not.be.undefined;
            expect(this).to.equal(obj);

            cb(null, content);
            done();
        }, obj);

        source.write(input());
        source.end();
    });

    // this test simulates a gulp task, to make sure this
    // module is compatible in a pipeline
    it('writes vinyl files as the output', function (done) {
        var files = [fileBuffer(), fileBuffer(), fileBuffer()];
        var count = 0;

        inputStream(files)
            .pipe(each(function(content, file, cb) {
                cb(null, content);
            }))
            .on('data', function onFile(file) {
                expect(file).to.be.instanceOf(File);
                expect(file).to.have.property('contents');

                count += 1;
            })
            .on('error', done)
            .on('end', function () {
                expect(count).to.equal(files.length);

                done();
            });
    });
});
