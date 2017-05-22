'use strict';


module.exports = function (selector,speed,headerHeight,selectorTargetHeight) {
	$(selector).on('click',function (event) {
		var target = $(this).attr("href");
		var destination = $(target).offset().top;
		$('body,html').animate({scrollTop: destination-headerHeight}, speed);
		return false;
	});
}