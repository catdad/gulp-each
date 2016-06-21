# gulp-each

[![Build][1]][2] [![Test Coverage][3]][4] [![Code Climate][5]][6] [![Downloads][7]][8] [![Version][9]][8] [![ISC License][10]][11] [![Analytics][12]][13]

[1]: https://img.shields.io/travis/catdad/gulp-each/master.svg?style=flat-square
[2]: https://travis-ci.org/catdad/gulp-each

[3]: https://img.shields.io/codeclimate/coverage/github/catdad/gulp-each.svg?style=flat-square
[4]: https://codeclimate.com/github/catdad/gulp-each/coverage

[5]: https://img.shields.io/codeclimate/github/catdad/gulp-each.svg?style=flat-square
[6]: https://codeclimate.com/github/catdad/gulp-each

[7]: https://img.shields.io/npm/dm/gulp-each.svg?style=flat-square
[8]: https://www.npmjs.com/package/gulp-each
[9]: https://img.shields.io/npm/v/gulp-each.svg?style=flat-square

[10]: https://img.shields.io/npm/l/gulp-each.svg?style=flat-square
[11]: http://opensource.org/licenses/ISC

[12]: https://ga-beacon.appspot.com/UA-17159207-7/gulp-each/readme?flat
[13]: https://github.com/igrigorik/ga-beacon

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
    gulp.src('*.js')
        .pipe(each(function(content, file, callback) {
            // content is a string containing the code
            // do with it as you'd like
            var newContent = '// my comment\n' + content;

            // file is the original Vinyl file object

            // return the new content using the callback
            // the first argument is an error, if you encounter one
            callback(null, newContent);
        })
        .pipe(gulp.dest('output'));
});
```

By default, `gulp-each` will assume that you are working with text files and use `utf8` as the encoding, returning a string as the `content` variable. At times, that will not be true. If you want to work with binary files, you can provide `'buffer'` as the second parameter:

```javascript
gulp.task('mytask', function() {
    gulp.src('*.png')
        .pipe(each(function(content, file, callback) {
            // content is a buffer containing the image
            var newConent = transformTheImageBuffer(content);

            // return the new content using the callback
            // the first argument is an error, if you encounter one
            callback(null, newContent);
        }, 'buffer')
        .pipe(gulp.dest('output'));
});
```
