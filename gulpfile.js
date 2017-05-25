'use strict'
const gulp = require('gulp'),
isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development',
 //NODE_ENV=prod
      $ = require('gulp-load-plugins')(),
      data = require('gulp-data'),
      fs = require('fs'),
      ifElse = require('gulp-if-else'),
      gulpIf = require('gulp-if'),
      path = require('path'),
      browserSync = require('browser-sync').create(),
      strip = require('gulp-strip-comments'),
      reload = browserSync.reload(),
      ExtractTextPlugin = require("extract-text-webpack-plugin"),
      WebpackNotifierPlugin = require('webpack-notifier');


      var PATHS = {
        iconsPic: 'frontend/styles/icons/raster/*.{jpg,png,gif}',
        stylesSprite: 'tmp/styles/',
        srcImagesContent: 'frontend/assets/images-content/**/*.*',
        iconsSvg: 'frontend/styles/icons/svg/**/*.svg',
        sprite: 'sprite.png',
        javascriptSrc: 'frontend/javascript/*.js',
        destJs: 'public/js',
        tmp: 'tmp',
        dist: 'public'
      };
      var injectsPaths = {
             fileIncludes: 'frontend/templates/section/_mixins.pug',
             components: 'frontend/templates/mixins/**/*.pug',
             injectStyl: 'frontend/styles/sections/**/*.styl',
             imjectStylMixins: 'frontend/styles/mixins/**/*.styl'
      }



gulp.task('styles', getTask('stylus'));
gulp.task('bower', getTask('bower'));
gulp.task('sprites:raster', getTask('sprite-raster'));
gulp.task('sprites:svg', getTask('sprite-svg'));
gulp.task('image', getTask('image'));
gulp.task('fontawesome', getTask('font-awesome'));
gulp.task('templates', getTask('tmp'));
gulp.task('serve', getTask('server'));
gulp.task('clean', getTask('cleanPublic'));
gulp.task('style', gulp.series('sprites:raster','sprites:svg','styles'));


function getTask(task) {
  return require('./gulp-tasks/' + task)(gulp, $,isDevelopment,path,ifElse,gulpIf,PATHS,data,fs,browserSync);
}


function injectsComponents() {
  var target = gulp.src(injectsPaths.fileIncludes,{base: injectsPaths.fileIncludes});
  return target.pipe($.inject(gulp.src(injectsPaths.components),{
    relative: true,
    ignorePath: 'frontend/templates/',
    addRootSlash: false,
    transform: function (filepath, file) {
        return 'include ' + filepath + '';
      }

  }))
  .pipe(gulp.dest(injectsPaths.fileIncludes))
  .pipe($.debug({title: 'injectsComponents'}))
}




gulp.task('watch',() =>{
 global.watch = true;

  gulp.watch('frontend/templates/**/*.pug', gulp.series('templates'))
    .on('all', (event, filepath) => {
      global.emittyChangedFile = filepath;
  });

  gulp.watch('frontend/javascript/*.js').on('change', gulp.series('js', browserSync.reload));
  gulp.watch(['frontend/assets/images-content','frontend/assets/images']).on('add', gulp.series('image'));
  gulp.watch(['frontend/styles/**/*.{styl,svg}', 'lib/**/*.css'], gulp.series('styles'));
  gulp.watch(PATHS.iconsPic).on('add', gulp.series('sprites:raster'));
  gulp.watch(PATHS.iconsPic).on('unlink', gulp.series('sprites:raster'));
  gulp.watch(PATHS.iconsSvg).on('change', gulp.series('sprites:svg','styles'));
  gulp.watch(PATHS.iconsSvg).on('unlink', gulp.series('sprites:svg','styles'));
  gulp.watch(PATHS.iconsSvg).on('add', gulp.series('sprites:svg','styles'));
  gulp.watch(injectsPaths.components).on('add', gulp.series(injectsComponents));
  gulp.watch(injectsPaths.components).on('unlink', gulp.series(injectsComponents));
  browserSync.watch('public/**/*.{css,png,svg,js,jpg,html}').on('change', browserSync.reload);
  browserSync.watch('public/**/*.{svg,png,jpg,eot,ttf,woff,woff2}').on('add', browserSync.reload);
  
});



gulp.task('js',function () {
 return gulp.src('frontend/javascript/*.js')
 .pipe(gulp.dest('public/js'));
});

gulp.task('build:pro', gulp.series('clean', gulp.parallel('image','style','templates','js','bower'))); 



gulp.task('dev', 
  gulp.series('build:pro', gulp.parallel('watch','serve'))

);














