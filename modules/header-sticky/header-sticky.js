'use strict';
module.exports = function (headerSelector,selector, headerHeight) {
	$(window).on('scroll',function () {
		var top  = $(document).scrollTop();
		if(top > headerHeight){
			$(headerSelector).addClass(selector)
		}
		else{
			if(top === 0){
				$(headerSelector).removeClass(selector)
			}
		}
	})

}