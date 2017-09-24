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
        middleware: function() {
        return [
                require('connect-gzip').gzip()
            ];
        }
    });
});

// remove all html dist files before processing html sources
gulp.task('html:clean', function() {
    return del([
        './dist/**/*.html'
    ]);
});

// create normal non-minified html with non-minified js and css
gulp.task('html:dev', function() {
    preprocessHtml({
        minifyHtml: false,
        context: {
            partialsSuffix: ''
        }
    })
});

// create minified html with minified js and css
gulp.task('html:prod', function() {
    preprocessHtml({
        minifyHtml: true,
        context: {
            partialsSuffix: '.min'
        }
    })
});

function preprocessHtml(opts) {
    gulp.src('./src/html/*.html')
        // insert variables into html
        // include partials
        .pipe(preprocess({context: opts.context}))
        // create dev and prod versions of html files
        .pipe(rename({suffix: opts.minifyHtml? '' : '.dev'}))
        // minify prod versions of html files
        .pipe(gulpif(opts.minifyHtml, htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('./dist/'))
}

// remove all html dist files before processing html sources
gulp.task('script:clean', function() {
    return del([
        './dist/js/*.js'
    ]);
});

// concat js files into one file
// create normal and minified versions of js file
gulp.task('script:homepage', function() {
    return generateJs(
        ['./src/js/vendor/jquery-3.1.0.slim.js', './src/js/vendor/wavesurfer.min.js',
         './src/js/home-common.js', './src/js/menu.js', './src/js/player.js', './src/js/modal.js'],
        'home.js'
    );
});

gulp.task('script:our-work', function() {
    return generateJs(
        ['./src/js/vendor/jquery-3.1.0.slim.js',
         './src/js/menu.js', './src/js/modal.js', './src/js/work-info.js'],
        'our-work.js'
    );
});

gulp.task('script:common', function() {
    return generateJs(
        ['./src/js/vendor/jquery-3.1.0.slim.js',
         './src/js/menu.js', './src/js/modal.js'],
        'common.js'
    );
});

function generateJs(files, name) {
    return gulp.src(files)
        .pipe(concat(name))
        .pipe(minify({ ext: { min:'.min.js' } }))
        .pipe(gulp.dest(paths.jsDestPath));
}

gulp.task('html', ['html:clean', 'html:dev', 'html:prod']);
gulp.task('scripts', ['script:clean', 'script:homepage', 'script:our-work', 'script:common']);
gulp.task('default', ['less', 'html', 'scripts', 'connect', 'watch']);
