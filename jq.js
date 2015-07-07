function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                 "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

$(function () {
	if (IsPC() == true) {
		$("#n3").hide();
	}

	var headerHeight = $("header").height();
	var headerOffsettop = $("header").offset().top;
	//alert(headerHeight);

	var width = $(window).width();
	var height = $(window).height();
	$("article").css('margin-top', headerHeight + headerOffsettop + height * 0.04);
	$("aside").css('margin-top', headerHeight + headerOffsettop + height * 0.04);
	var faceHeight = $("header #face").innerHeight();
	$("header #face").css('width', faceHeight);
	$("header #htmltitle").css('left', faceHeight * 1.4);
	$("header #introduction").css('left', faceHeight * 1.4);
	$("header #social").css('left', width - 300);
	var htmlHeight = $(document).height();
	var bodyHeight = $("body").height();
	
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
	if (IsPC() == true) {
		$("#n3").hide();
	}

	var headerHeight = $("header").height();
	var headerOffsettop = $("header").offset().top;

	var width = $(window).width();
	var height = $(window).height();
	$("article").css('margin-top', headerHeight + headerOffsettop + height * 0.04);
	$("aside").css('margin-top', headerHeight + headerOffsettop + height * 0.04);
	var faceHeight = $("header #face").innerHeight();
	$("header #face").css('width', faceHeight);
	$("header #htmltitle").css('left', faceHeight * 1.4);
	$("header #introduction").css('left', faceHeight * 1.4);
	$("header #social").css('left', width - 300);
	var htmlHeight = $(document).height();
	var bodyHeight = $("body").height();

	if (height < 500 && height >= 300) {
		$("html").css('font-size', 12);
	} else if (height < 300) {
		$("html").css('font-size', 9);
	} else if (height >= 700) {
		$("html").css('font-size', 16);
	}
});