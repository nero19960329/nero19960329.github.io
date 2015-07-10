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
	if (width >= 960) {
		$("header").css('width', bodyWidth);
		$("header #face").css('width', 150);
		$("article").css('margin-top', 30);
		if ($("html").attr('class') != "blogs") {
			console.log("ininin  " + width);
			$('article').css('width', 0.8 * width - 110);
		}
	} else {
		var faceHeight = $("header #face").innerHeight();
		$("header").css('width', bodyWidth);
		$("header #face").css('width', faceHeight);
		$("header #htmltitle").css('left', faceHeight * 1.2);
		$("header #introduction").css('left', faceHeight * 1.2);
		$("article").css('margin-top', headerHeight + headerOffsettop + height * 0.04);
		$("article").css('width', bodyWidth * 0.9);
	}

	if (height < 300) {
		$("header #introduction").css('display', 'none');
		$("header #face").css('display', 'none');
		$("header #nav").css('display', 'none');
	} else {
		$("header #introduction").css('display', 'block');
		$("header #face").css('display', 'block');
		$("header #nav").css('display', 'block');
	}
	
	/*var contactme_margin = $("article #contact-me").width();
	if (contactme_margin != undefined) {
		$("article").css('margin-left', (width - 160) / 2);
		$("article").css('margin-right', (width - 160) / 2);
	}*/
}

$(function () {
	// 不让电脑上只有手机才能看到的网页
	if ($("html").attr('class') == "mobile" && IsPC() == true) {
		self.location='index.html';
	}

	setType();
})

$(window).resize(function() {
	setType();
});