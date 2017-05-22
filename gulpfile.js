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
      webpackStream = require('webpack-stream'),
      webpack = webpackStream.webpack,
      gulpWebpack = require('gulp-webpack'),
      named = require('vinyl-named'),
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
gulp.task('sprites:raster', getTask('sprite-raster'));
gulp.task('sprites:svg', getTask('sprite-svg'));
gulp.task('image', getTask('image'));
gulp.task('fontawesome', getTask('font-awesome'));
gulp.task('templates', getTask('tmp'));
gulp.task('serve', getTask('server'));
gulp.task('clean', getTask('cleanPublic'));
gulp.task('style', gulp.series('sprites:raster','sprites:svg','styles'))


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





function wrapRegexp(regexp, label) {
  regexp.test = function(path) {
    return RegExp.prototype.test.call(this, path);
  };
  return regexp;
}



gulp.task('webpack:js', function (callback) {
  let firstBuildReady = false;

  function done (err,stats) {
     firstBuildReady = true;

    if(err){
      return 
    }
  }
 
  let options = {
   output: {
     publicPath: '/js/'
   },
    watch: true,
    devtool: isDevelopment ? 'cheap-module-inline-source-map' : null,
    resolve: {
      root: [__dirname + '/vendor',__dirname + '/modules', __dirname + '/lib'],
      alias: {
        'owl.js': 'owl.carousel/dist/owl.carousel.js',
        'owl.css': 'owl.carousel/dist/assets/owl.carousel.css',
        'select.css': 'select2/dist/css/select2.css',
        'select.js': 'select2/dist/js/select2.js'
      }
    },

    module: {
      loaders: [{
        test: /\.js$/,
        include: path.join(__dirname, "frontend"),
        exclude: /\/node_modules\//,
        loader: 'babel?presets[]=es2015'
      },

      {
        test: /\.(png|jpg|svg|ttf|eot|woff|woff2|gif)$/,
        loader: 'file?name=[path][name].[ext]'
      },{
        test:  /\.css$/,
        loader: ExtractTextPlugin.extract('css')

      },

      ],
      noParse: wrapRegexp(/\/node_modules\/[^!]+$/, 'noParse')
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: "common"
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        "window.jQuery": "jquery"
      }),
      new ExtractTextPlugin('[name].css',{allChunks: true}),
      
      new WebpackNotifierPlugin({
        title: 'Javascript',
        contentImage: path.join(__dirname, 'gulp-tasks/notify/js_notify/javascript.jpg')
      }),
       new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
        )
    ]
    
  };
  return gulp.src(PATHS.javascriptSrc)
    .pipe(named())
    .pipe(gulpWebpack(options, null,done,webpack))
   
    .pipe(gulpIf(!isDevelopment,gulpIf('*.css', $.csso())))
    .pipe(gulpIf('*.css', gulp.dest('public'),gulp.dest(PATHS.destJs)))
    .on('data', function () {
        if(firstBuildReady){
          callback();
        }
    });
  });




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

gulp.task('build:pro', gulp.series('clean', gulp.parallel('image','style','templates','js'))); 



gulp.task('dev', 
  gulp.series('build:pro', gulp.parallel('watch','serve'))

);






// gulp.task('webpack:pug',function (callback) {
//   let firstBuildReady = false;

//   function done (err,stats) {
//      firstBuildReady = true;
//      if(err){
//        return 
//      }

//   }

//   let options = {
//     watch: true,
//     module:{
//       loaders:[
//       {
//         test: /\.pug$/, loaders: ['file-loader?name=[name].html','pug-html-loader?pretty&exports=false'],
//         options: {
//           doctype: 'htmldldldll'
//         }
//       },
     
//       ]
//     },
//     plugins: [
//       new WebpackNotifierPlugin({
//         title: 'Pug',
//         contentImage: path.join(__dirname, 'notify/pug_notify/pug.jpg')
//       })
//     ]
//   }

//   return gulp.src('frontend/templates/*pug')
//     .pipe(named())
//     .pipe(gulpWebpack(options,null,done,webpack))
//     .pipe($.replace('<!DOCTYPE html><!DOCTYPE js>', '<!DOCTYPE html>'))
//     .pipe(gulpIf('*.html',gulp.dest('public')))
//     .on('data', function () {
//         if(firstBuildReady){
//           callback();
//         }
//     });
// });









