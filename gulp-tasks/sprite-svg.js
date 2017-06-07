
module.exports = function (gulp, $,isDevelopment,path,ifElse,gulpIf,PATHS,data,fs,browserSync) {
	return function () {
	  return gulp.src(PATHS.iconsSvg)
	    .pipe($.svgSprite({
	      mode:{
	        css:{
	          dest: '.',
	          bust: false,
	          sprite: '../images/sprite.svg',
	          dimensions: true,
	          prefix: '$',
	          render:{
	            styl: {
	              dest: 'sprites_svg.styl'
	            }
	          }
	        }
	      },
	      svg:{
	        doctypeDeclaration: false
	      }
	    }))
	    .pipe($.debug({
	      title: 'svg'
	    }))
	    .pipe(gulpIf('*.styl',gulp.dest("tmp/styles"), gulp.dest('public/images')))
	};
}