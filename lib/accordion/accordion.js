function accordion() {
	var accordionBtn = $('.accordion__btn--js');
	accordionBtn.click(function() {
		$(this).parent().toggleClass('active').siblings().removeClass('active');
	});

}
accordion();