function getEvent() { 
	return window.event || arguments.callee.caller.arguments[0]; 
}

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

document.body.onkeydown = function() {
	var e = getEvent();
	if (e.keyCode == 36) {
		pageScroll();
		return false;
	}
};
document.body.onscroll = function() {
	var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
	var totop = document.getElementsByClassName('totop');
	if (scrollTop == 0) {
		totop[0].style.display = "none";
	} else {
		totop[0].style.display = "inline";
	}
};
document.body.onresize = function() {
	console.log('backtotop_dom -- onresize');
	var totop = document.getElementsByClassName('totop');
	//console.log(totop[0].getAttribute("id"));
	totop[0].style.position = "fixed";
	if (totop[0].getAttribute("id") == "totop_leftdown") {
		totop[0].style.top = (document.body.clientHeight - 70) + "px";
	} else if (totop[0].getAttribute("id") == "totop_rightup") {
		totop[0].style.left = (document.body.clientWidth - 70) + "px";
	} else if (totop[0].getAttribute("id") == "totop_rightdown") {
		totop[0].style.top = (document.body.clientHeight - 70) + "px";
		totop[0].style.left = (document.body.clientWidth - 70) + "px";
		console.log(totop[0].style.cssText);
	}
};

function BackToTop() {
	this.init = function() {
		var widget = document.createElement('p');
		widget.setAttribute("class", "totop");

		widget.style.cssText = "background-image: url(../src/totop_unhover.png); width: 50px; height: 50px; border-radius: 50%; position: fixed;";
		if (typeof(arguments[0].x) == "number" && typeof(arguments[0].y) == "number") {
			widget.setAttribute('id', 'totop_xy');
			console.log("x: " + arguments[0].x + ", y: " + arguments[0].y);
			widget.style.left = arguments[0].x + "px";
			widget.style.top =  arguments[0].y + "px";
		} else if (typeof(arguments[0].LeftUp) == "boolean") {
			widget.setAttribute('id', 'totop_leftup');
			widget.style.left = 0;
			widget.style.top = 0;
		} else if (typeof(arguments[0].LeftDown) == "boolean") {
			widget.setAttribute('id', 'totop_leftdown');
			widget.style.left = 0;
			widget.style.top = (document.documentElement.clientHeight - 70) + "px";
		} else if (typeof(arguments[0].RightUp) == "boolean") {
			widget.setAttribute('id', 'totop_rightup');
			widget.style.left = (document.documentElement.clientWidth - 70) + "px";
			widget.style.top = 0;
		} else if (typeof(arguments[0].RightDown) == "boolean") {
			widget.setAttribute('id', 'totop_rightdown');
			widget.style.left = (document.documentElement.clientWidth - 70) + "px";
			widget.style.top = (document.documentElement.clientHeight - 70) + "px";
		} else if (typeof(arguments[0].Custom == "string")) {
			if (arguments[0].Custom == "index") {
				widget.setAttribute('id', 'titio_custom_index');
				widget.style.left = (0.8 * document.documentElement.clientWidth - 80) + "px";
				widget.style.top = (document.documentElement.clientHeight - 230) + "px";
			} else if (arguments[0].Custom == "blogs") {
				widget.setAttribute('id', 'totop_custom_blogs');
				widget.style.left = (0.975 * document.documentElement.clientWidth - 25) + "px";
				widget.style.top = (document.documentElement.clientHeight - 230) + "px";
			}
		}
		document.body.appendChild(widget);

		var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
		if (scrollTop == 0) {
			widget.style.display = "none";
		}

		widget.onmouseup = function() {
			pageScroll();
		};
		widget.onmouseover = function() {
			this.style.backgroundImage = url("../src/totop_hover.png");
		};
		widget.onmoueout = function() {
			this.style.backgroundImage = url("../src/totop_unhover.png");
		}
	}
}