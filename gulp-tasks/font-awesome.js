module.exports = function (gulp) {
	var filesToMove = [
	  './node_modules/fa-stylus/fonts/**/*.*',
	];

	return function () {
	  return gulp.src(filesToMove)
	    .pipe(gulp.dest('public/font-awesome'));
	};
}