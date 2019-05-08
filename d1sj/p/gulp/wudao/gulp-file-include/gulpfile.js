var gulp = require('gulp');
var fileinclude = require('gulp-file-include');

gulp.task('fileinclude', function () {
    // 适配page中所有文件夹下的所有html，排除page下的include文件夹中html
    gulp.src(['page/*.html', '!page/include/**.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@filesssss',
            prefix: '@@',//变量前缀 @@include
            indent: true//保留文件的缩进
        }))
        .pipe(gulp.dest('dist'));
});