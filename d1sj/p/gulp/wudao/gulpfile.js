var gulp = require('gulp');
var fileinclude = require('gulp-file-include');
var del = require('del');
var vinylPaths = require('vinyl-paths');

// gulp.task('clean:dist', function () {
//     return gulp.src('dist/*')
//       .pipe(vinylPaths(del));
// });

//gulp.task('fileinclude', function () {
//    gulp.src('src/**')
//        .pipe(fileinclude({
//            prefix: '@@',
//            basepath: '@file'
//        }))
//    .pipe(gulp.dest('dist'));
//});

gulp.task('fileinclude', function () {
    gulp.src('page/**')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            indent: true
        }))
    .pipe(gulp.dest('dist'));
});
