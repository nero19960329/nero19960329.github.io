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
			$('article').css('width', 0.8 * width - 160);
		} else {
			$('article').css('width', bodyWidth * 0.9);
		}
		$("aside").css('display', 'block');
	} else {
		var faceHeight = $("header #face").innerHeight();
		$("header").css('width', bodyWidth);
		$("header #face").css('width', faceHeight);
		$("header #htmltitle").css('left', faceHeight * 1.2);
		$("header #introduction").css('left', faceHeight * 1.2);
		$("article").css('margin-top', headerHeight + headerOffsettop + height * 0.04);
		$("article").css('width', bodyWidth * 0.9);
		$("aside").css('display', 'none');
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
}

$(function () {
	// 不让电脑上只有手机才能看到的网页
	if ($("html").attr('class') == "mobile" && IsPC() == true) {
		self.location='index.html';
	}

	setType();
})


$(document).bind({
	keydown: function(e) {
		if (e.keyCode == '36') {
			pageScroll();
			return false;
		}
	}
});

$(window).bind({
	scroll: function() {
		if (document.body.scrollTop == 0) {
			$('.totop').css('display', 'none');
		} else {
			$('.totop').css('display', 'inline');
		}
	},

	resize: function() {
		setType();
		var totop = $('.totop');
		var width = $(window).width();
		var height = $(window).height();
		if (totop.attr('id') == 'totop_xy') {
			totop.css('top', totop.attr('top'));
			totop.css('left', totop.attr('left'));
		} else if (totop.attr('id') == 'totop_leftdown') {
			totop.css('top', height - 70);
		} else if (totop.attr('id') == 'totop_rightup') {
			totop.css('left', width - 70);
		} else if (totop.attr('id') == 'totop_rightdown') {
			totop.css('top', height - 70);
			totop.css('left', width - 70);
		} else if (totop.attr('id') == 'totop_custom_index') {
			totop.css('left', 0.8 * width - 80);
			totop.css('top', height - 230);
		} else if (totop.attr('id') == 'totop_custom_blogs') {
			totop.css('left', 0.975 * width - 25);
			totop.css('top', height - 230);
		}
	}
});