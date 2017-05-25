
var bower = require('gulp-bower');

module.exports = function (gulp) {
	return function () {
		return bower()
		 .pipe(gulp.dest('public/bower'))
	};
}