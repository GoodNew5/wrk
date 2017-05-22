module.exports = function (gulp, $,isDevelopment,path,ifElse,gulpIf,PATHS,data,fs,browserSync) {
	return function (argument) {
		    browserSync.init({
		      server: {
		        baseDir: 'public'
		      },
		      notify: false,
		      reloadDelay: 0,
		      browser: "google chrome",
		      minify: true
		});
	}
}