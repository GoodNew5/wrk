
module.exports = function (gulp, $,isDevelopment,path,ifElse,gulpIf,PATHS) {
	return function () {
	  var spriteData = gulp.src('frontend/styles/icons/raster/*.{jpg,png,gif}')
	  .pipe($.spritesmith({
	    imgName: 'sprite.png',
	    cssName: 'sprites_raster.styl',
	    imgPath: '../images/sprite.png'
	    // retinaImgName: '../images/sprite@2x.png',
	    // retinaSrcFilter: 'frontend/styles/icons/raster/*@2x.{jpg,png,gif}'
	  }));
	  return spriteData.img.pipe(gulp.dest('public/images')),
	    spriteData.css.pipe(gulp.dest(PATHS.stylesSprite))

	};
}