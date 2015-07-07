$(function () {
	var width = $(window).width();
	var height = $(window).height();
	var faceHeight = $("header #face").innerHeight();
	$("header #face").css('width', faceHeight);
	$("header #htmltitle").css('left', faceHeight * 1.4);
	$("header #introduction").css('left', faceHeight * 1.4);
	$("header #social").css('left', width - 300);

	if (height < 500 && height >= 300) {
		$("html").css('font-size', 12);
	} else if (height < 300) {
		$("html").css('font-size', 9);
	} else if (height >= 700) {
		$("html").css('font-size', 16);
	}
})

$(window).resize(function() {
	var width = $(window).width();
	var height = $(window).height();
	var faceHeight = $("header #face").innerHeight();
	$("header #face").css('width', faceHeight);
	$("header #htmltitle").css('left', faceHeight * 1.4);
	$("header #introduction").css('left', faceHeight * 1.4);
	$("header #social").css('left', width - 300);

	if (height < 500 && height >= 300) {
		$("html").css('font-size', 12);
	} else if (height < 300) {
		$("html").css('font-size', 9);
	} else if (height >= 700) {
		$("html").css('font-size', 16);
	}
});