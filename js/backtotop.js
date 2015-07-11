function pageScroll() {
	var scrollTime = 200, scrollInterval = 40;
	var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
	var nowScrollTop = scrollTop;
	var scrolldelay = setInterval(function() {
		window.scrollBy(0, -nowScrollTop * scrollInterval / scrollTime);
		if ((document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop) == 0) {
			clearInterval(scrolldelay);
		}
	}, scrollInterval);
}

function BackToTop() {
	this.init = function() {
		var widget = $('<p class="totop" />');
		var width = $(window).width();
		var height = $(window).height();
		if (typeof(arguments[0].x) == "number" && typeof(arguments[0].y) == "number") {
			widget.attr('id', 'totop_xy');
			widget.css('left', arguments[0].x);
			widget.css('top', arguments[0].y);
		} else if (typeof(arguments[0].x) == "string" && typeof(arguments[0].y) == "string"
					&& parseFloat(arguments[0].x) != "undefined" && parseFloat(arguments[0].y) != "undefined") {
			widget.attr('id', 'totop_xy');
			widget.css('left', parseFloat(arguments[0].x));
			widget.css('top', parseFloat(arguments[0].y));
		} else if (typeof(arguments[0].LeftUp) == "boolean" && arguments[0].LeftUp == true) {
			console.log("12123123");
			widget.attr('id', 'totop_leftup');
			widget.css('left', 0);
			widget.css('top', 0);
		} else if (typeof(arguments[0].LeftDown) == "boolean" && arguments[0].LeftDown == true) {
			widget.attr('id', 'totop_leftdown');
			widget.css('left', 0);
			widget.css('top', height - 70);
		} else if (typeof(arguments[0].RightUp) == "boolean" && arguments[0].RightUp == true) {
			widget.attr('id', 'totop_rightup');
			widget.css('left', width - 70);
			widget.css('top', 0);
		} else if (typeof(arguments[0].RightDown) == "boolean" && arguments[0].RightDown == true) {
			widget.attr('id', 'totop_rightdown');
			widget.css('left', width - 70);
			widget.css('top', height - 70);
		} else if (typeof(arguments[0].Custom == "string")) {
			if (arguments[0].Custom == "index") {
				widget.attr('id', 'totop_custom_index');
				widget.css('left', 0.8 * width - 80);
				widget.css('top', height - 230);
			} else if (arguments[0].Custom == "blogs") {
				widget.attr('id', 'totop_custom_blogs');
				widget.css('left', 0.975 * width - 25);
				widget.css('top', height - 230);
			}
		}
		$('body').append(widget);

		var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
		if (scrollTop == 0) {
			$('.totop').css('display', 'none');
		}

		widget.bind({
			mouseup: function(e) {
				pageScroll();
			}
		});
	}
}