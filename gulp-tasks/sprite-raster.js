

module.exports = function (gulp, $,isDevelopment,path,ifElse,gulpIf,PATHS) {
	return function () {
	  var spriteData = gulp.src(PATHS.iconsPic)

	  .pipe($.spritesmith({
	    imgName: 'sprite.png',
	    cssName: 'sprites_raster.styl',
	    imgPath: '../images/sprite.png'
	  }))
	  return spriteData.img.pipe(gulp.dest('public/images')),
	    spriteData.css.pipe(gulp.dest(PATHS.stylesSprite))

	};
}