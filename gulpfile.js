var gulp       = require('gulp'),
    gulpif     = require('gulp-if'),
    connect    = require('gulp-connect'),
    less       = require('gulp-less'),
    minifyCSS  = require('gulp-minify-css'),
    rename     = require('gulp-rename'),
    del        = require('del'),
    concat     = require('gulp-concat'),
    minify     = require('gulp-minify'),
    preprocess = require('gulp-preprocess'),
    htmlmin    = require('gulp-htmlmin');

var paths = {
    lessAllFiles: './src/less/**/*.less',
    lessGeneralFiles: './src/less/*.less',
    cssDestPath: './dist/css/',
    htmlSrcAllFiles: './src/html/**/*.html',
    jsDestPath: './dist/js/',
    jsAllFiles: './src/js/**/*.js'
};

var env = {};

gulp.task('prod-env', function() {
    env.NODE_ENV = 'production';
});

// generates css files from less
// create normal and minified versions of css files
gulp.task('less', function () {
    return gulp.src(paths.lessGeneralFiles)
        .pipe(less())
        .pipe(gulp.dest(paths.cssDestPath))
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.cssDestPath));
});

// watches for changes in files
gulp.task('watch', function() {
    gulp.watch(paths.lessAllFiles, ['less']);
    gulp.watch(paths.htmlSrcAllFiles, ['html']);
    gulp.watch(paths.jsAllFiles, ['scripts']);
});

// create node server to open page locally
gulp.task('connect', function() {
    connect.server({
        port: process.env.PORT || 8084,
        root: './dist/',
    });
});

// remove all html dist files before processing html sources
gulp.task('html:clean', function() {
    return del([
        './dist/**/*.html'
    ]);
});

// create normal non-minified html with non-minified js and css
gulp.task('html:dev', gulp.series('html:clean', function() {
    let context = Object.assign({ partialsSuffix: '' }, env);
    return preprocessHtml({
        minifyHtml: false,
        context: context
    })
}));

// create minified html with minified js and css
gulp.task('html:prod', gulp.series('html:dev', function() {
    let context = Object.assign({ partialsSuffix: '.min' }, env);
    return preprocessHtml({
        minifyHtml: true,
        context: context
    })
}));

function preprocessHtml(opts) {
    return gulp.src('./src/html/*.html')
        // insert variables into html
        // include partials
        .pipe(preprocess({context: opts.context}))
        // create dev and prod versions of html files
        .pipe(rename({suffix: opts.minifyHtml? '' : '.dev'}))
        // minify prod versions of html files
        .pipe(gulpif(opts.minifyHtml, htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('./dist/'))
}

// remove all javascript dist files before processing javascript sources
gulp.task('script:clean', function() {
    return del([
        './dist/js/*.js'
    ]);
});

// concat js files into one file
// create normal and minified versions of js file
gulp.task('script:homepage', function() {
    return generateJs(
        ['./src/js/vendor/jquery-3.2.1.js', './src/js/vendor/jquery.animateNumber.js', './src/js/vendor/noty.js',
         './src/js/vendor/wavesurfer.min.js', './src/js/home-common.js', './src/js/menu.js', './src/js/player.js',
         './src/js/modal.js', './src/js/metrics.js'],
        'home.js'
    );
});

gulp.task('script:our-work', function() {
    return generateJs(
        ['./src/js/vendor/jquery-3.2.1.js',
         './src/js/menu.js', './src/js/modal.js', './src/js/work-info.js'],
        'our-work.js'
    );
});

gulp.task('script:common', function() {
    return generateJs(
        ['./src/js/vendor/jquery-3.2.1.js',
         './src/js/menu.js', './src/js/modal.js'],
        'common.js'
    );
});

gulp.task('script:info', function() {
    return generateJs(
        ['./src/js/vendor/jquery-3.2.1.js',
        './src/js/menu.js', './src/js/modal.js',
         './src/js/overlay.js'],
        'info.js'
    );
});

gulp.task('script:thank-you', function() {
    return generateJs(
        ['./src/js/vendor/jquery-3.2.1.js',
        './src/js/menu.js', './src/js/modal.js',
         './src/js/thank-you.js'],
        'thank-you.js'
    );
});

function generateJs(files, name) {
    return gulp.src(files)
        .pipe(concat(name))
        .pipe(minify({ ext: { min:'.min.js' } }))
        .pipe(gulp.dest(paths.jsDestPath));
}

gulp.task('html', gulp.series('html:clean', 'html:dev', 'html:prod'));
gulp.task('scripts', gulp.series('script:clean', 'script:homepage', 'script:our-work', 'script:common', 'script:info', 'script:thank-you'));
gulp.task('build', gulp.series('less', 'html', 'scripts'));
gulp.task('build:prod', gulp.series('prod-env', 'less', 'html', 'scripts'));
gulp.task('default', gulp.series('less', 'html', 'scripts', 'connect', 'watch'));
