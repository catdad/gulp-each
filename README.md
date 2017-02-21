# gulp-each

[![Build][1]][2]
[![Test Coverage][3]][4]
[![Code Climate][5]][6]
[![Downloads][7]][8]
[![Version][9]][8]
[![Dependency Status][10]][11]
[![ISC License][12]][13]
[![Analytics][14]][15]

[1]: https://travis-ci.org/catdad/gulp-each.svg?branch=master
[2]: https://travis-ci.org/catdad/gulp-each

[3]: https://codeclimate.com/github/catdad/gulp-each/badges/coverage.svg
[4]: https://codeclimate.com/github/catdad/gulp-each/coverage

[5]: https://codeclimate.com/github/catdad/gulp-each/badges/gpa.svg
[6]: https://codeclimate.com/github/catdad/gulp-each

[7]: https://img.shields.io/npm/dm/gulp-each.svg
[8]: https://www.npmjs.com/package/gulp-each
[9]: https://img.shields.io/npm/v/gulp-each.svg

[10]: https://david-dm.org/catdad/gulp-each.svg
[11]: https://david-dm.org/catdad/gulp-each

[12]: https://img.shields.io/npm/l/gulp-each.svg
[13]: http://opensource.org/licenses/ISC

[14]: https://ga-beacon.appspot.com/UA-17159207-7/gulp-each/readme
[15]: https://github.com/igrigorik/ga-beacon

A for-each for Gulp that exposes the actual content of the file.

I have had to write this code many times because I wanted a "one-off" task that does "somthing quick" to each file. Or, I have wanted to write literally any module that processes code files, and had to start anew every time and figure out this logic.

Most other for-each implementations for Gulp expose the stream (of buffer) object, requiring the user to read the stream (or buffer) and write out a new stream (or buffer). _Yes, I used the most annoying way to word that on purpose._ This module exposes the content of the file itself, so you can directly start manipulating the content (e.g. code) directly, without worrying about the Gulp plumbing.

## Download

```bash
npm install gulp-each
```

## Usage

```javascript
var each = require('gulp-each');

gulp.task('mytask', function() {
    return gulp.src('*.js')
        .pipe(each(function(content, file, callback) {
            // content is a string containing the code
            // do with it as you'd like
            var newContent = '// my comment\n' + content;

            // file is the original Vinyl file object

            // return the new content using the callback
            // the first argument is an error, if you encounter one
            callback(null, newContent);
        }))
        .pipe(gulp.dest('output'));
});
```

By default, `gulp-each` will assume that you are working with text files and use `utf8` as the encoding, returning a string as the `content` variable. At times, that will not be true. If you want to work with binary files, you can provide `'buffer'` as the second parameter:

```javascript
gulp.task('mytask', function() {
    return gulp.src('*.png')
        .pipe(each(function(content, file, callback) {
            // content is a buffer containing the image
            var newConent = transformTheImageBuffer(content);

            // return the new content using the callback
            // the first argument is an error, if you encounter one
            callback(null, newContent);
        }, 'buffer'))
        .pipe(gulp.dest('output'));
});
```
