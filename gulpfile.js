/**
 * Created by oleg on 30.04.2016.
 */
'use strict';
const gulp             = require('gulp');
const wiredep          = require('wiredep').stream;
const jade             = require("gulp-jade");
const clean            = require('del');
const sass             = require('gulp-sass');
const newer            = require('gulp-newer');
const imagemin         = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const autopref         = require('gulp-autoprefixer');
const remember         = require('gulp-remember');
const cached           = require('gulp-cached');
const chokidar         = require('chokidar');
const concat           = require('gulp-concat');
const bs               = require('browser-sync').create();
const notify           = require('gulp-notify');
const multipipe        = require('multipipe');
const uglifyjs         = require('gulp-uglifyjs');
const svgsprite        = require('gulp-svgsprite');
//const resolver         = require("gulp-resolver");

// bower
// gulp.task('bower', function() {
//   gulp.src('app/index.html')
//       .pipe(wiredep({
//         directory : "app/bower_components"
//       }))
//       .pipe(gulp.dest('app/'));
// });
//server
gulp.task('server', function () {
  bs.init({
    server: 'public'
  });
  bs.watch('public/**/*.*').on('change', bs.reload);
});
//jade
gulp.task('jade', function(){
  return multipipe(
      gulp.src('frontend/*.jade'),
      jade({
        'pretty': true,
        'compileDebug': true
      }),
      gulp.dest('public')).on('error', notify.onError());
});
//sass
gulp.task('sass', function(){
  return multipipe(
      gulp.src('frontend/sass/style.sass'),
      autopref(),
      newer('public'),
      remember('sass'),
      sass(),
      gulp.dest('public')
  ).on('error', notify.onError());
});
// sass svg
gulp.task('sass:svg', function(){
  return multipipe(
      gulp.src('frontend/sass/menu/**/*.svg'),
          svgsprite({
            mode: {
              css: {
                dest:   '.',
                bust: false,
                sprite: 'sprite.svg',
                layout: 'vertical',
                prefix: '$',
                dimensions: true,
                render: {
                  css: true
                }
              }
            }
          }),
      gulp.dest('public/images/')
  )
});
//script
gulp.task('scripts', function(){
  return gulp.src([
        'frontend/assets/jquery/dist/jquery.js',
        'frontend/assets/jQuery.mmenu/dist/js/jquery.mmenu.all.min.js',
        'frontend/assets/superfish/dist/js/superfish.js',
        'frontend/assets/animate.css/animate-css.js'
      ])
      .pipe(newer('public/js/'))
      .pipe(concat('all.js'))
      .pipe(uglifyjs())
      .pipe(gulp.dest('public/js/'))
});
// images
gulp.task('img', function(){
  gulp.src('frontend/images/*.{png,jpg,gif,svg}')
      .pipe(newer('public/images'))
      .pipe(imagemin({
        progressive: true,
        svgPlugins: [{removeViewBox: false}],
        use: [imageminPngquant()]
      }))
      .pipe(gulp.dest('public/images'))
});
// clean
gulp.task('clean', function(){
  return clean('public/contact.html')
});

// watch
gulp.task('watch', function(){
  var watcher = gulp.watch('frontend/sass/**/*.sass', ['sass']);
  watcher.on('change', function(event){
    if(event.type === 'delete') {
      delete cached.caches['sass'][event.path];
      remember.forget('sass', event.path);
    }
  });
  gulp.watch('public/js/*.js', ['scripts']);
  gulp.watch('frontend/**/*.jade', ['jade']);
});

// default
gulp.task('default', ['watch', 'server']);