const gulpIf = require('gulp-if'),
      resolver = require('stylus').resolver,
      postStylus = require('poststylus'),
      fontAwesomeStylus = require("fa-stylus"),
      cssNano = require('gulp-cssnano'),
      autoprefixer = require('autoprefixer'),
      browsersList = require('../browserList.json'),
      browserSync = require('browser-sync').create();
      

var PATHS = {
  stylusRoot: '/../frontend/styles/base.styl',
  stylusBreakpoints: '/../frontend/styles/breakpoints.styl',
  stylusTmp: '/../tmp/styles/*.styl',
  stylusMixins: '/../frontend/styles/mixins/**/*.styl',
  blocks: '/../frontend/styles/blocks/**/*.styl',
  typo: '/../frontend/styles/typo.styl',
  layout: '/../frontend/styles/layout.styl',
  state: '/../frontend/styles/state.styl',
  theme: '/../frontend/styles/theme.styl',
  common: '/../frontend/styles/common.styl'
}


module.exports = function (gulp, $, isDevelopment,path,ifElse) {
    
  return function(callback){
      return  gulp.src('frontend/styles/styles.styl')
      .pipe(gulpIf(isDevelopment, $.sourcemaps.init()))
      .pipe($.plumber({
              errorHandler: $.notify.onError(function (err) {
                return{
                  title: 'Stylus fail',
                  message: err.message,
                  icon: path.join(__dirname, 'notify/stylus_notify/stylus.jpg'),
                  sound: false

                }
              })
        }))
      .pipe($.stylus({
        define: {
          url: resolver()
        },
        import: [
        __dirname  + PATHS.common,
        __dirname  + PATHS.theme,
        __dirname  + PATHS.stylusBreakpoints, // брекпойнты (переменные с размерами экранов)
        __dirname  + PATHS.stylusMixins, //миксины
        __dirname  + PATHS.stylusTmp, // временные файлы (спрайты svg, raster)
        __dirname  + PATHS.stylusRoot, // root 
        __dirname  + PATHS.blocks,
        __dirname  + PATHS.typo,
        __dirname  + PATHS.layout,
        __dirname  + PATHS.state
       
        ],
         'include css': true,
         use: [
            postStylus(
              autoprefixer({browserslist: browsersList}),
              fontAwesomeStylus()
          )]
      }))
      .pipe($.debug({title: 'stylus'}))
     
      .pipe(gulpIf(!isDevelopment,cssNano({
        core: false,
        autoprefixer: false,
        zindex: false
      })))
      .pipe(gulpIf(isDevelopment,$.sourcemaps.write()))
      .pipe(gulp.dest('public/css'))
      .pipe(browserSync.stream());
    }
    
};