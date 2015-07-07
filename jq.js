$(function () {
	var width = $(window).width();
	var height = $(window).height();
	var faceHeight = $("header #face").innerHeight();
	$("header #face").css('width', faceHeight);
	$("header #htmltitle").css('left', faceHeight * 1.4);
	$("header #introduction").css('left', faceHeight * 1.4);
	$("header #social").css('left', width - 300);
	var htmlHeight = $(document).height();
	var bodyHeight = $("body").height();
	//var DocumentHeight = $(document.body).outerHeight(true);
	//$("footer").css('top', DocumentHeight * 0.95);
	//alert($(document).outerHeight(true));
	//alert($("article").height());
	//alert(height + " " + htmlHeight + " " + bodyHeight);
	
	var contactme_margin = $("article #contact-me").width();
	if (contactme_margin != undefined) {
		$("article").css('margin-left', (width - 160) / 2);
		$("article").css('margin-right', (width - 160) / 2);
	}

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
	var htmlHeight = $(document).height();
	$("footer").css('top', htmlHeight);

	if (height < 500 && height >= 300) {
		$("html").css('font-size', 12);
	} else if (height < 300) {
		$("html").css('font-size', 9);
	} else if (height >= 700) {
		$("html").css('font-size', 16);
	}
});