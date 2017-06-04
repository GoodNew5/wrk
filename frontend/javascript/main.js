
function tabs(domElement){
  var active = 'active';
  var content = $('.tab-content__item');
  
    $(domElement).click(function () {
      var index = $(this).index();
      content.eq(index).addClass(active).siblings().removeClass(active);
      $(this).addClass(active).siblings().removeClass(active);
  });
}

tabs('.tab-links__item');

function accordion(domElement) {
	$(domElement).click(function() {
    $(domElement).next().not($(this).next()).slideUp();
		$(this).next().stop().slideToggle();
	});
}
accordion('.accordion__btn--js');
