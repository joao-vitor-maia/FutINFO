function rotateSlide() {
	var activeSlide = $('.slide > .active'),
			nextSlide = activeSlide.next();
	
	if(nextSlide.length == 0) {
		nextSlide = $('.slide > :first');
	}
	activeSlide.removeClass('active');
	nextSlide.addClass('active');
} 
setInterval(rotateSlide, 2000);
