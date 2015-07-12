document.body.onresize = function() {
	var fog = document.getElementById("fog");
	fog.style.width = document.body.clientWidth + "px";
	fog.style.height = document.body.clientHeight + "px";
};

function getEvent() { 
	return window.event || arguments.callee.caller.arguments[0]; 
} 

function Modal() {
	this.init = function(arg) {
		var mWindowWidth = 300;
		var mWindowHeight = 200;
		var mBarHeight = 27;
		var mFooterWidth = 80;
		var mFooterHeight = 40;
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();

		var fog = document.createElement('div');
		fog.setAttribute("id", "fog");
		fog.style.cssText = "position: fixed; left: 0; top: 0; background-color: #FFF; filter: Alpha(Opcacity=30); opacity: 0.5; z-index: 10000; width: " + windowWidth +  "px; height: " + windowHeight + "px;";
		document.body.appendChild(fog);

		var mWindow = document.createElement('div');
		mWindow.style.cssText = "position: fixed; left: " + ((windowWidth - mWindowWidth) / 2) + "px; top: " + ((windowHeight - mWindowHeight) / 2) + "px; background-color: #FFF; z-index: 10001; width: " + mWindowWidth + "px; height: " + mWindowHeight + "px; border-radius: 5px; box-shadow: 3px 3px 10px #aaa;";
		document.body.appendChild(mWindow);

		var mBar = document.createElement('div');
		mBar.style.cssText = "background-color: #e6ddc3; z-index: 10001; width: " + mWindowWidth + "px; height: " + mBarHeight + "px; margin: 0; cursor: default;";
		if (typeof(arg.draggable) == "undefined" || arg.draggable == "true") {
			var mouseX = 0, mouseY = 0;
			var moveable = false;
			var toTop = 0, toLeft = 0;			

			// 绑定到全局中，判断鼠标是否在bar里，然后再做响应改动
			document.body.onmousedown = function() {
				var e = getEvent();
				toTop = parseInt(mWindow.style.top);
				toLeft = parseInt(mWindow.style.left);
				mouseX = e.clientX;
				mouseY = e.clientY;
				if (mouseX >= toLeft && mouseX <= toLeft + mWindowWidth &&
					mouseY >= toTop && mouseY <= toTop + mBarHeight) {
					moveable = true;
				}
			};
			document.body.onmousemove = function() {
				var e = getEvent();
				if (moveable == true) {
					var x = toLeft + e.clientX - mouseX;
					var y = toTop + e.clientY - mouseY;
					mWindow.style.left = x + "px";
					mWindow.style.top = y + "px";
				}
			}
			document.body.onmouseup = function() {
				moveable = false;
			}
		}
		mWindow.appendChild(mBar);

		var mCloseButton = document.createElement('div');
		mCloseButton.style.cssText = "float: right; background-image: url(../src/closebutton_normal.png); width: 30px; height: 27px;";
		mCloseButton.onmousedown = function() {
			this.style.backgroundImage = "url(../src/closebutton_down.png)";
		};
		mCloseButton.onmouseup = function() {
			this.style.backgroundImage = "url(../src/closebutton_hover.png)";
			document.body.removeChild(mWindow);
			document.body.removeChild(fog);
		};
		mCloseButton.onmouseover = function() {
			this.style.backgroundImage = "url(../src/closebutton_hover.png)";
		};
		mCloseButton.onmouseout = function() {
			this.style.backgroundImage = "url(../src/closebutton_normal.png)";
		}
		mBar.appendChild(mCloseButton);

		var mWindowIcon = document.createElement('div');
		mWindowIcon.style.cssText = "float: left; background-image: url(../src/mWindowIcon.png); width:27px; height: 27px;";
		mBar.appendChild(mWindowIcon);

		var mBarText = document.createElement('div');
		mBarText.innerHTML = "Attension";
		mBarText.style.cssText = "float: left; margin-left: 8px; width: " + (mWindowWidth - 65) + "px; height: " + mBarHeight + "px; line-height: " + mBarHeight + "px; user-select: none; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; -khtml-user-select: none; cursor: default;";
		mBar.appendChild(mBarText);

		if (typeof(arg.content) != "undefined") {
			var mWindowText = document.createElement('div');
			mWindowText.innerHTML = arg.content;
			mWindowText.style.cssText = "margin: 0; text-align: center; width: " + mWindowWidth + "px; height: " + (mWindowHeight - mBarHeight - mFooterHeight) + "px; line-height: " + (mWindowHeight - mBarHeight - mFooterHeight) + "px; overflow: hidden; cursor: default;";
			mWindow.appendChild(mWindowText);
		}

		var mOKButton = document.createElement('div');
		mOKButton.innerHTML = "OK";
		mOKButton.style.cssText = "margin-top: 0; margin-left: " + ((mWindowWidth - mFooterWidth) / 2) + "px; width: " + mFooterWidth + "px; height: 20px; text-align: center; background-image: url(../src/okbutton_normal.png); cursor: default; user-select: none; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; -khtml-user-select: none; cursor: default;";
		mOKButton.onmousedown = function() {
			this.style.backgroundImage = "url(../src/okbutton_down.png)";
		};
		mOKButton.onmouseup = function() {
			this.style.backgroundImage = "url(../src/okbutton_hover.png)";
			document.body.removeChild(mWindow);
			document.body.removeChild(fog);
		};
		mOKButton.onmouseover = function() {
			this.style.backgroundImage = "url(../src/okbutton_hover.png)";
		};
		mOKButton.onmouseout = function() {
			this.style.backgroundImage = "url(../src/okbutton_normal.png)";
		};
		mWindow.appendChild(mOKButton);

		document.body.onkeyup = function() {
			var e = getEvent();
			if (e.keyCode == 27) {
				document.body.removeChild(mWindow);
				document.body.removeChild(fog);
			}
		}
		if (typeof(arg.closeKey) == "number") {
			document.body.onkeyup = function() {
				var e = getEvent();
				if (e.keyCode == arg.closeKey) {
					document.body.removeChild(mWindow);
					document.body.removeChild(fog);
				}
			};
		}
	}
}