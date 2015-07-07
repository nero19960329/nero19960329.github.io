$(function () {
	var faceHeight = $("header #face").innerHeight();
	$("header #face").css('width', faceHeight);
	$("header #htmltitle").css('left', faceHeight * 1.3);

	var width = $(window).width();
	var height = $(window).height();

	if (height < 500 && height >= 300) {
		$("html").css('font-size', 12);
	} else if (height < 300) {
		$("html").css('font-size', 9);
	}
	alert(height);
})

$(window).resize(function() {
	var faceHeight = $("header #face").innerHeight();
	$("header #face").css('width', faceHeight);
	$("header #htmltitle").css('left', faceHeight * 1.3);

	var width = $(window).width();
	var height = $(window).height();

	if (height < 500 && height >= 300) {
		$("html").css('font-size', 12);
	} else if (height < 300) {
		$("html").css('font-size', 9);
	}
});