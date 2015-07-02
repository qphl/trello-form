/*global open: true*/

var gulp = require('gulp');

var livereload = require('gulp-livereload');
var connect = require('connect');
var servestatic = require('serve-static');

var rename = require('gulp-rename');
var browserify = require('browserify');
var watchify = require('watchify');
var es6ify = require('es6ify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');

/* config vars */
var serverPort = 8888;
var liveReloadPort = 35731;

/* file paths */
var dist = 'dist';

var htmlFiles = './app/**/*.html';
var jsxFiles = './app/**/*.jsx';
var entryFile = './app/app.jsx';
var scssFiles = './app/styles/*.scss';

var config = {
    debug: false
};

var vendorFiles = [
    'node_modules/es6ify/node_modules/traceur/bin/traceur-runtime.js'
];

var vendorBuild = dist + '/vendor';

gulp.task('vendor', function () {
    var ret = gulp.src(vendorFiles);
    
    if(!config.debug)
        ret.pipe(uglify());

    ret.pipe(gulp.dest(vendorBuild));
    return ret;
});

gulp.task('html', function () {
    return gulp.src(htmlFiles).
                pipe(gulp.dest(dist));
});

gulp.task('scripts', function() {
    return compileScripts(false);
});

gulp.task('styles', function() {
  return gulp.src(scssFiles)
    .pipe(sass({ style: 'compressed' }))
    .pipe(gulp.dest(dist));
});

function compileScripts(watch) {
    var bundler = browserify({
        cache: {}, packageCache: {}, fullPaths: true,
        entries: [ entryFile ],
        extensions: ['.js', '.jsx'],
        debug: config.debug
    });
    if (watch) {
        bundler = watchify(bundler);
    }

    es6ify.traceurOverrides = { experimental: true };

    bundler.transform(reactify);
    bundler.transform(es6ify.configure(/.jsx/));

    var rebundle = function () {
        var stream = bundler.bundle();

        stream.on('error', function (err) { console.error(err); });
        stream = stream.pipe(source(entryFile));

        if(!config.debug)    
            stream.pipe(streamify(uglify()));
        
        stream.pipe(rename('app.js'));
        stream.pipe(gulp.dest(dist));
    };

    bundler.on('update', rebundle);
    return rebundle();
}

gulp.task('server', function (next) {
    var server = connect();
    server.use(servestatic(dist)).listen(serverPort, next);
});

function initWatch(files, task) {
    if (typeof task === "string") {
        gulp.start(tfask);
        gulp.watch(files, [task]);
    } else {
        task.map(function (task) { gulp.start(task); });
        gulp.watch(files, task);
    }
}

//configuration variables for dev builds
gulp.task('configure-dev', function() {
    config.debug = true;
});

//configuration variables for release builds
gulp.task('configure-release', function() {
    config.debug = false;
});

gulp.task('build', [ 'vendor', 'html','styles', 'scripts' ]);

gulp.task('watch', function () {
    var lrServer = livereload(liveReloadPort);
    var reloadPage = function (evt) {
        lrServer.changed(evt.path);
    };

    function initWatch(files, task) {
        gulp.start(task);
        gulp.watch(files, [task]);
    }

    compileScripts(true);
    initWatch(htmlFiles, 'html');
    initWatch(scssFiles, 'styles');

    gulp.watch([dist + '/**/*'], reloadPage);
});

//perform a development build
gulp.task('dev', ['configure-dev', 'build']);

//dev build and spin up a live-reload web server
gulp.task('serve', ['dev','server', 'watch']);

//perform a release build
gulp.task('release', ['configure-release', 'build']);

gulp.task('default', ['dev']);