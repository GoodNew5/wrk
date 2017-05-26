function accordion() {
	var accordionBtn = $('.accordion__btn--js');
	var content = $('.accordion__content');
	accordionBtn.click(function() {
		$(this).parent().toggleClass('active').siblings().removeClass('active');
	});

}
accordion()