const {
    src,
    dest,
    parallel,
    series,
    watch,
    lastRun
} = require('gulp');

// Load plugins

const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const gulpif = require('gulp-if');
const preprocess = require('gulp-preprocess');
const htmlmin = require('gulp-htmlmin');
const browsersync = require('browser-sync').create();

const srcLess = './src/less/*.less';
const srcLessAndModules = './src/less/**';
const srcHtml = './src/html/*.html';
const srcHtmlAndModules = './src/html/**';
const srcImages = './src/images/**';
const srcAudio = './src/audio/*';
const srcFonts = './src/fonts/*';
const srcJs = './src/js/*.js';
const srcJsStatic = './src/js/vendor/*.js';

const srcJsMapping = [
    { inputs: ['./src/js/home-common.js', './src/js/menu.js', './src/js/player.js', './src/js/modal.js', './src/js/metrics.js'], output: 'home.js' },
    { inputs: ['./src/js/menu.js', './src/js/modal.js', './src/js/work-info.js'], output: 'our-work.js' },
    { inputs: ['./src/js/menu.js', './src/js/modal.js'], output: 'common.js' },
    { inputs: ['./src/js/menu.js', './src/js/modal.js', './src/js/overlay.js'], output: 'info.js' },
    { inputs: ['./src/js/menu.js', './src/js/modal.js', './src/js/thank-you.js'], output: 'thank-you.js' },
];

// Clean assets

function clear() {
    return src('./dist/*', { read: false })
        .pipe(clean());
}

// JS function 

function js (done) {
    const combine = (inputs, output) => {
    return src(inputs)
        //.pipe(changed(inputs))
        .pipe(concat(output))
        .pipe(dest('./dist/js/'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest('./dist/js/'))
        //.pipe(browsersync.stream());
    }

    const combineTasks = srcJsMapping.map(obj => {
        return taskDone => {
            combine(obj.inputs, obj.output)
            taskDone()
        }
    });

    const vendorTask = taskDone => {
        src(srcJsStatic).pipe(uglify()).pipe(rename({ extname: '.min.js' })).pipe(dest('./dist/js/vendor/'))
        taskDone();
    };

    return series(...combineTasks, vendorTask, seriesDone => {
        seriesDone();
        done();
    })();
}

// CSS function 

function css() {
    return src(srcLess)
        .pipe(changed(srcLess))
        .pipe(less())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(cssnano())
        .pipe(dest('./dist/css/'))
        .pipe(browsersync.stream());
}

// HTML function

function html() {
    return src(srcHtml)
        .pipe(preprocess())
        //.pipe(htmlmin({collapseWhitespace: true}))
        .pipe(dest('./dist/'))
}

// Optimize images

function images() {
    return src(srcImages, {since: lastRun(images)})
        .pipe(imagemin())
        .pipe(dest('./dist/images'));
}

// Static assets

function fonts () {
    return src(srcFonts, { since: lastRun(fonts) })
        .pipe(dest('./dist/fonts'));
}

function audio () {
    return src(srcAudio, { since: lastRun(audio) })
        .pipe(dest('./dist/audio'));
}

// Watch files

function watchFiles() {
    watch(srcLessAndModules, css);
    watch(srcJs, js);
    watch(srcImages, images);
    watch(srcHtmlAndModules, html);
    watch(srcAudio, audio);
    watch(srcFonts, fonts);
}

// BrowserSync

function browserSync() {
    browsersync.init({
        server: {
            baseDir: './dist/',
            index: "home.html",
            serveStaticOptions: {
                extensions: ["html"]
            }
        },
        port: process.env.PORT || 8084,
        open: false,
        rewriteRules: [
            {
                match: /src=\"js\/([a-zA-Z0-9\-]+).min.js\"/g,
                replace: "src=\"js/$1.js\""
            }
        ]
    });
}

const build = series(clear, parallel(js, css, images, html, audio, fonts));
exports.watch = series(build, parallel(watchFiles, browserSync));
exports.default = build;
