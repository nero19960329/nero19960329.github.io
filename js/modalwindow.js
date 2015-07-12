$(window).bind({
	resize: function() {
		$('#fog').css('width', $(window).width());
		$('#fog').css('height', $(window).height());
	}
});

function Modal() {
	this.init = function(arg) {
		var mWindowWidth = 300;
		var mWindowHeight = 200;
		var mBarHeight = 27;
		var mFooterWidth = 80;
		var mFooterHeight = 40;
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();

		var fog = $('<div />');
		fog.attr('id', 'fog');
		fog.css('position', 'fixed');
		fog.css('left', 0);
		fog.css('top', 0);
		fog.css('background-color', '#FFF');
		fog.css('filter', 'Alpha(Opacity=30)');
		fog.css('opacity', '0.5');
		fog.css('z-index', '10000');
		fog.css('width', windowWidth);
		fog.css('height', windowHeight);
		$('html').append(fog);

		var mWindow = $('<div />');
		mWindow.css('position', 'fixed');
		mWindow.css('left', (windowWidth - mWindowWidth) / 2);
		mWindow.css('top', (windowHeight - mWindowHeight) / 2);
		mWindow.css('background-color', '#FFF');
		mWindow.css('z-index', '10001');
		mWindow.css('width', mWindowWidth);
		mWindow.css('height', mWindowHeight);
		mWindow.css('border-radius', '5px');
		mWindow.css('box-shadow', '3px 3px 10px #aaa');
		$('html').append(mWindow);

		var mBar = $('<div />');
		mBar.css('background-color', '#e6ddc3');
		mBar.css('z-index', '10001');
		mBar.css('width', mWindowWidth);
		mBar.css('height', mBarHeight);
		mBar.css('margin', '0');
		mBar.css('cursor', 'default');
		if (typeof(arg.draggable) == "undefined" || arg.draggable == "true") {
			var mouseX = 0, mouseY = 0;
			var moveable = false;
			var toTop = 0, toLeft = 0;			

			/* 绑定到全局中，判断鼠标是否在bar里，然后再做响应改动 */
			$(window).bind({
				mousedown: function(e) {
					toTop = parseInt(mWindow.css('top'));
					toLeft = parseInt(mWindow.css('left'));
					mouseX = e.clientX;
					mouseY = e.clientY;
					if (mouseX >= toLeft && mouseX <= toLeft + mWindowWidth &&
						mouseY >= toTop && mouseY <= toTop + mBarHeight) {
						moveable = true;
					}
				},

				mousemove: function(e) {
					if (moveable == true) {
						var x = toLeft + e.clientX - mouseX;
						var y = toTop + e.clientY - mouseY;
						mWindow.css('left', x + 'px');
						mWindow.css('top', y + 'px');
					}
				},

				mouseup: function(e) {
					moveable = false;
				}
			});
		}
		mWindow.append(mBar);

		var mCloseButton = $('<div />');
		mCloseButton.css('float', 'right');
		mCloseButton.css('background-image', 'url("../src/closebutton_normal.png")');
		mCloseButton.hover(
			function(e) {
				$(this).css('background-image', 'url("../src/closebutton_hover.png")');
			},
			function(e) {
				$(this).css('background-image', 'url("../src/closebutton_normal.png")');
			});
		mCloseButton.css('width', 30);
		mCloseButton.css('height', 27);
		mCloseButton.bind({
			mousedown: function(e) {
				$(this).css('background-image', 'url("../src/closebutton_down.png")');
			},
			mouseup: function(e) {
				$(this).css('background-image', 'url("../src/closebutton_hover.png")');
				mWindow.remove();
				fog.remove();
			}
		});
		mBar.append(mCloseButton);

		var mWindowIcon = $('<div />');
		mWindowIcon.css('float', 'left');
		mWindowIcon.css('background-image', 'url("../src/mWindowIcon.png")');
		mWindowIcon.css('width', 27);
		mWindowIcon.css('height', 27);
		mBar.append(mWindowIcon);

		var mBarText = $('<div>Attension</div>');
		mBarText.css('float', 'left');
		mBarText.css('margin-left', 8);
		mBarText.css('width', mWindowWidth - 65);
		//mBarText.css('border', '1px solid #000');
		mBarText.css('line-height', mBarHeight + 'px');
		mBarText.css('height', mBarHeight + 'px');
		mBarText.css('user-select', 'none'); /*禁止选中文本*/
		mBarText.css('-moz-user-select', 'none'); /*火狐*/
		mBarText.css('-webkit-user-select', 'none');  /*webkit浏览器*/
		mBarText.css('-ms-user-select', 'none');   /*IE10*/
		mBarText.css('-khtml-user-select', 'none'); /*早期浏览器*/
		mBarText.css('cursor', 'default');
		mBar.append(mBarText);

		if (arg.content != "undefined") {
			var mWindowText = $('<div>' + arg.content + '</div>');
			mWindowText.css('margin', '0');
			mWindowText.css('text-align', 'center');
			mWindowText.css('width', mWindowWidth);
			mWindowText.css('height', mWindowHeight - mBarHeight - mFooterHeight);
			mWindowText.css('line-height', (mWindowHeight - mBarHeight - mFooterHeight) + 'px');
			mWindowText.css('overflow', 'hidden');
			mWindowText.css('cursor', 'default');
			mWindow.append(mWindowText);
		}

		var mOKButton = $('<div>OK</div>');
		mOKButton.css('margin-top',  '0');
		mOKButton.css('margin-left', (mWindowWidth - mFooterWidth) / 2);
		mOKButton.css('width', mFooterWidth);
		mOKButton.css('height', 20);
		mOKButton.css('text-align', 'center');
		mOKButton.css('background-image', 'url("../src/okbutton_normal.png")');
		mOKButton.css('cursor', 'default');
		mOKButton.hover(
			function(e) {
				$(this).css('background-image', 'url("../src/okbutton_hover.png")');
			},
			function(e) {
				$(this).css('background-image', 'url("../src/okbutton_normal.png")');
			});
		mOKButton.bind({
			mousedown: function(e) {
				$(this).css('background-image', 'url("../src/okbutton_down.png")');
			},
			mouseup: function(e) {
				$(this).css('background-image', 'url("../src/okbutton_hover.png")');
				mWindow.remove();
				fog.remove();
			}
		});
		mOKButton.css('user-select', 'none'); /*禁止选中文本*/
		mOKButton.css('-moz-user-select', 'none'); /*火狐*/
		mOKButton.css('-webkit-user-select', 'none');  /*webkit浏览器*/
		mOKButton.css('-ms-user-select', 'none');   /*IE10*/
		mOKButton.css('-khtml-user-select', 'none'); /*早期浏览器*/
		mWindow.append(mOKButton);
	}
}

var m = new Modal();
m.init({content: "niconiconi~"});