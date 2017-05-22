
module.exports = function (gulp, $,isDevelopment,path,ifElse,gulpIf,PATHS) {
  return function (done) {
    var format = ['frontend/assets/images-content/**/*.{jpg,png}','frontend/assets/images/**/*.{png,jpg}'];
    return  gulp.src(format, {base: 'frontend/assets'})
    .pipe($.newer('public'))
    .pipe($.plumber())
    .pipe(gulpIf(!isDevelopment,
      $.image({
        pngquant: true,
        optipng: true,
        zopflipng: false,
        jpegRecompress: true,
        jpegoptim: false,
        mozjpeg: false,
        gifsicle: true,
        svgo: false,
        concurrent: 10
        })
      ))
    .pipe(gulp.dest(PATHS.dist))
  };

}