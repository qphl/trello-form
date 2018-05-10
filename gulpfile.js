/* global open: true */

const gulp = require('gulp');
const livereload = require('gulp-livereload');
const connect = require('connect');
const servestatic = require('serve-static');
const rename = require('gulp-rename');
const browserify = require('browserify');
const watchify = require('watchify');
const es6ify = require('es6ify');
const reactify = require('reactify');
const source = require('vinyl-source-stream');
const streamify = require('gulp-streamify');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');


/* config vars */
const liveReloadPort = 35729;


/* file paths */
const dist = 'dist';
const htmlFiles = './app/**/*.html';
const entryFile = './app/app.jsx';
const scssFiles = './app/styles/*.scss';
const imageFiles = './app/images/*.*';

const vendorFiles = [
  'node_modules/traceur/bin/traceur-runtime.js',
];

const vendorBuild = `${dist}/vendor`;

const config = {
  debug: false,
};


// configuration variables for dev builds
gulp.task('configure-dev', () => {
  config.debug = true;
});


// configuration variables for release builds
gulp.task('configure-release', () => {
  config.debug = false;
});


gulp.task('vendor', () => {
  const ret = gulp.src(vendorFiles);

  if (!config.debug) { ret.pipe(uglify()); }

  ret.pipe(gulp.dest(vendorBuild));
  return ret;
});


gulp.task('html', () => gulp.src(htmlFiles)
  .pipe(gulp.dest(dist)));


function compileScripts(watch) {
  let bundler = browserify({
    cache: {},
    packageCache: {},
    fullPaths: true,
    entries: [entryFile],
    extensions: ['.js', '.jsx'],
    debug: config.debug,
  });
  if (watch) {
    bundler = watchify(bundler);
  }

  es6ify.traceurOverrides = { experimental: true };

  bundler.transform(reactify);
  bundler.transform(es6ify.configure(/.jsx/));

  const rebundle = function Rebundle() {
    let stream = bundler.bundle();

    stream.on('error', (err) => { console.error(err); });
    stream = stream.pipe(source(entryFile));

    if (!config.debug) { stream.pipe(streamify(uglify())); }

    stream.pipe(rename('app.js'));
    stream.pipe(gulp.dest(dist));
  };

  bundler.on('update', rebundle);
  return rebundle();
}


gulp.task('scripts', () => compileScripts(false));


gulp.task('styles', () => gulp.src(scssFiles)
  .pipe(sass({ style: 'compressed' }))
  .pipe(gulp.dest(dist)));


gulp.task('images', () => gulp.src(imageFiles)
  .pipe(gulp.dest(dist)));


gulp.task('server', (next) => {
  const server = connect();
  server.use(servestatic(dist)).listen(8000, next);
});


gulp.task('copy-config', () => {
  gulp.src(['config.js']).pipe(gulp.dest('dist'));
});


gulp.task('build', ['vendor', 'html', 'styles', 'images', 'scripts', 'copy-config']);


gulp.task('watch', () => {
  livereload({ port: liveReloadPort, start: true });
  const reloadPage = function ReloadPage(evt) {
    livereload.changed(evt.path);
  };

  function initWatch(files, task) {
    gulp.start(task);
    gulp.watch(files, [task]);
  }

  compileScripts(true);
  initWatch(htmlFiles, 'html');
  initWatch(scssFiles, 'styles');

  gulp.watch([`${dist}/**/*`], reloadPage);
});


// perform a development build
gulp.task('dev', ['configure-dev', 'build']);


// dev build and spin up a live-reload web server
gulp.task('serve', ['dev', 'server', 'watch']);


// perform a release build
gulp.task('dist', ['configure-release', 'dist']);


gulp.task('default', ['dev']);
