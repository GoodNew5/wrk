$("#range").ionRangeSlider({
    type: "double",
    min: 610000,
    max: 360000000,
    grid: false
});
var containerCard = $('.cards-container');
var switchOnBars = $('.switch-on-bars');
var switchOnColumns = $('.switch-on-columns');

switchOnBars.on('click', function () {
	containerCard.addClass('cards-container--bars');
	switchOnBars.addClass('active');
	switchOnColumns.removeClass('active');
});
switchOnColumns.on('click', function () {
	containerCard.removeClass('cards-container--bars');
	switchOnBars.removeClass('active');
	switchOnColumns.addClass('active');

});