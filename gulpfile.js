var gulp      = require('gulp'),
    less      = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    rename    = require('gulp-rename');

var paths = {
    lessAllFiles: './public/src/less/**/*.less',
    lessGeneralFiles: './public/src/less/*.less',
    cssAllFiles: './public/cdn/css/*.css',
    cssDestFiles: './public/cdn/css',
    cssMinDestFiles: './public/cdn/css/min'
};

// minifies required css files with ".min" suffix
gulp.task('minify-css', function() {
    return gulp.src(paths.cssAllFiles)
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.cssMinDestFiles));
});

// generates css files from less
gulp.task('less', function () {
    return gulp.src(paths.lessGeneralFiles)
        .pipe(less())
        .pipe(gulp.dest(paths.cssDestFiles));
});

// watches for changes in files (currently for *.less)
gulp.task('watch', function() {
    gulp.watch(paths.lessAllFiles, ['less']);
});

gulp.task('default', ['less', 'watch']);
gulp.task('production', ['minify-css']);