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

function setType() {
	if (IsPC() == true) {
		$("#n3").hide();
	}

	var headerHeight = $("header").height();
	var headerOffsettop = $("header").offset().top;
	var width = $(window).width();
	var height = $(window).height();
	var htmlHeight = $(document).height();
	var bodyHeight = $("body").height();
	var bodyWidth = $("body").width();
	console.log($("html").attr('class'));
	if (width > 960) {
		if ($("html").attr('class') != "blogs") {
			$('article').css('width', 0.8 * width - 110);
		}
	} else {
		var faceHeight = $("header #face").innerHeight();
		$("header #face").css('width', faceHeight);
		$("header #htmltitle").css('left', faceHeight * 1.2);
		$("header #introduction").css('left', faceHeight * 1.2);
		$("article").css('margin-top', headerHeight + headerOffsettop + height * 0.04);
		$("header").css('width', bodyWidth);
	}
	
	var contactme_margin = $("article #contact-me").width();
	if (contactme_margin != undefined) {
		$("article").css('margin-left', (width - 160) / 2);
		$("article").css('margin-right', (width - 160) / 2);
	}
}

$(function () {
	setType();
})

$(window).resize(function() {
	setType();
});