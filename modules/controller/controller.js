
function uiController(domElement){
 var data = domElement.data();
 domElement.toggleClass('active');
 $(data.target).toggleClass('active');
 $(data.remove).removeClass('active');
}

$(controller).click(function(e){
  uiController($(this));
  e.preventDefault();
});
