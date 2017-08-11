module.exports = function (gulp, $,isDevelopment,path,ifElse,gulpIf,PATHS,data,fs) {
   var emitty = require('emitty').setup('frontend/templates', 'pug',{
    makeVinylFile: true
  });
  return () =>
    new Promise((resolve, reject) => {
      emitty.scan(global.emittyChangedFile).then(() => {
        gulp.src('frontend/templates/*.pug')
          .pipe(gulpIf(global.watch, emitty.filter(global.emittyChangedFile)))
          .pipe($.plumber({
                errorHandler: $.notify.onError(function (err) {
                  return{
                    title: 'pug fail',
                    message: err.message,
                    icon: path.join(__dirname, 'notify/pug_notify/pug.jpg'),
                    sound: false
                  }
                })
          }))
          .pipe(data( function(file) {
               return JSON.parse(
                 fs.readFileSync('frontend/templates/data.json')
               );
          }))
          .pipe($.pug({
            pretty: '    ',
            basedir: __dirname + '../lib'
          }))
          .pipe(gulp.dest('public'))
          .on('end', resolve)
          .on('error', reject);
      });
    })
  
}