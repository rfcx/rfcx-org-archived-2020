var gulp      = require('gulp'),
    less      = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    rename    = require('gulp-rename'),
    bless     = require('gulp-bless');

var paths = {
    lessAllFiles: './developer/less/**/*.less',
    lessGeneralFiles: './developer/less/*.less',
    cssAllFiles: './public/cdn/css/**/*.css',
    cssDestPath: './public/cdn/css/generated',
    cssMinDest: './public/cdn/css/generated/min',
    cssGeneratedFiles: './public/cdn/css/generated/*.css'
};

// minifies required css files with ".min" suffix
gulp.task('minify-css', function() {
    return gulp.src(paths.cssGeneratedFiles)
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.cssMinDest));
});

// generates css files from less
gulp.task('less', function () {
    return gulp.src(paths.lessGeneralFiles)
        .pipe(less())
        .pipe(gulp.dest(paths.cssDestPath));
});

// watches for changes in files (currently for *.less)
gulp.task('watch', function() {
    gulp.watch(paths.lessAllFiles, ['less', 'bless']);
});

gulp.task('bless', function() {
  return gulp
    .src(paths.cssGeneratedFiles)
    .pipe(bless())
    .pipe(gulp.dest(paths.cssDestPath));
});


gulp.task('default', ['less', 'bless', 'watch']);
gulp.task('production', ['minify-css']);