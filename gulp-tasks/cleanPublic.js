const del = require('del');

module.exports = function (gulp) {
	return function(){
	  return del(['public', 'tmp'])
	};
}