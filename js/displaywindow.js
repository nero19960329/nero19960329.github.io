$(window).bind({
	resize: function() {
		$('#fog').css('width', $(window).width());
		$('#fog').css('height', $(window).height());
	}
});

function DisplayWindow(arg) {
	var mWindowWidth = $(window).width() * 0.9;
	var mWindowHeight;
	var changedWidth = arg.width;
	var changedHeight = arg.height;
	if (arg.width > mWindowWidth * 0.75) {
		changedWidth = mWindowWidth * 0.75 - 20;
		changedHeight = arg.height * (mWindowWidth * 0.75 - 20) / arg.width;
	}
	if (changedHeight > 600) {
		changedWidth = changedWidth * 600 / changedHeight;
		changedHeight = 600;
	}
	mWindowHeight = 600;
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
	fog.bind({
		mouseup: function() {
			closeWindow();
		}
	});
	$('html').append(fog);

	var mWindow = $('<div id="mWindow" />');
	mWindow.css('position', 'fixed');
	var mWindowLeft = (windowWidth - mWindowWidth) / 2, mWindowTop;
	if (mWindowHeight > windowHeight - 100) {
		mWindowTop = 20;
	} else {
		mWindowTop = (windowHeight - mWindowHeight) / 2;
	}
	mWindow.css('background-color', '#FFF');
	mWindow.css('z-index', '10001');
	mWindow.css('border-radius', '5px');
	mWindow.css('box-shadow', '3px 3px 10px #000');
	mWindow.css('overflow', 's')
	mWindow.css('width', 0);
	mWindow.css('height', 0);
	mWindow.css('left', windowWidth / 2);
	mWindow.css('top', windowHeight / 2);
	openWindow();
	mWindow.css('width', mWindowWidth);
	mWindow.css('height', mWindowHeight);
	mWindow.css('left', (windowWidth - mWindowWidth) / 2);
	mWindow.css('top', mWindowTop);
	$('html').append(mWindow);

	var mCloseButton = $('<div />');
	mCloseButton.css('position', 'absolute');
	mCloseButton.css('left', mWindowWidth - 17.5);
	mCloseButton.css('top', - 17.5);
	mCloseButton.css('cursor', 'pointer');
	mCloseButton.css('background-image', 'url("src/photo_close_normal.png")');
	mCloseButton.hover(
		function(e) {
			$(this).css('background-image', 'url("src/photo_close_hover.png")');
		},
		function(e) {
			$(this).css('background-image', 'url("src/photo_close_normal.png")');
		});
	mCloseButton.css('width', 35);
	mCloseButton.css('height', 35);
	mCloseButton.bind({
		mouseup: function(e) {
			$(this).css('background-image', 'url("src/photo_close_hover.png")');
			closeWindow();
		}
	});
	mCloseButton.css('display', 'none');
	mWindow.append(mCloseButton);

	var mPhotoArea = $('<div />');
	mPhotoArea.css('position', 'absolute');
	mPhotoArea.css('left', 0);
	mPhotoArea.css('top', 0);
	mPhotoArea.css('width', mWindowWidth * 0.75);
	mPhotoArea.css('height', mWindowHeight);
	mPhotoArea.css('background-color', '#000');
	mPhotoArea.css('display', 'none');
	mWindow.append(mPhotoArea);

	var mPhoto = $('<img src="src/photo/' + arg.srcPath + '"/>');
	mPhoto.error(function() {
		var mPhotoError = $('<div class="photo_big_error">加载失败！</div>');
		mPhotoError.css('position', 'absolute');
		mPhotoError.css('top', (mPhotoArea.height() - 20) / 2);
		mPhotoArea.append(mPhotoError);
		mPhoto.css('display', 'none');
	});
	mPhoto.css('position', 'absolute');
	mPhoto.css('left', (mPhotoArea.width() - changedWidth) / 2);
	mPhoto.css('width', changedWidth);
	mPhoto.css('height', changedHeight);
	mPhoto.css('top', (mPhotoArea.height() - changedHeight) / 2);
	mPhoto.css('display', 'none');
	mPhotoArea.append(mPhoto);

	var mGeoArea = $('<div />');
	if (locationFlag == true) {
		mGeoArea.html('距离您' + parseInt(getDistance({latitude: locallatitude, longitude: locallongitude}, {latitude: arg.latitude, longitude: arg.longitude})) + '千米');
	} else {
		mGeoArea.html('获取地理位置失败！');
	}
	mGeoArea.css('position', 'absolute');
	mGeoArea.css('width', mWindowWidth * 0.21 - 20);
	mGeoArea.css('height', 100);
	mGeoArea.css('padding', 10);
	mGeoArea.css('left', mWindowWidth * 0.77);
	mGeoArea.css('top', 10);
	mGeoArea.css('font-family', 'Microsoft YaHei');
	mGeoArea.css('font-size', '0.9em');
	mGeoArea.css('text-align', 'center');
	mGeoArea.css('line-height', '80px');
	mWindow.append(mGeoArea);

	var mTextArea = $('<div />');
	mTextArea.css('position', 'absolute');
	mTextArea.css('width', mWindowWidth * 0.21 - 20);
	mTextArea.css('height', 450);
	mTextArea.css('padding', 10);
	mTextArea.css('font-family', 'Microsoft YaHei');
	mTextArea.css('font-size', '0.7em');
	mTextArea.css('left', mWindowWidth * 0.77);
	mTextArea.css('top', 100);
	mTextArea.css('background-color', '#f2f2f5');
	mWindow.append(mTextArea);
	createLoadingText();

	function createmText(json) {
		var commentnum = json.comments.length;
		for (var i = 0; i < commentnum; ++i) {
			var mText = $('<div class="mText" />');
			var mTextUser = $('<span style="color: #eb7d5f;">'+ decodeURI(json.comments[i].user, "utf-8") + '网友</span>');
			var mTextComment = $('<span>：' + decodeURI(json.comments[i].content, "utf-8") + '</span>');
			var mTextDate = $('<div style="color: #888; margin-top: 10px;">' + json.comments[i].month + '月' + json.comments[i].date + '日</div>');
			
			mText.append(mTextUser);
			mText.append(mTextComment);
			mText.append(mTextDate);
			mText.css('margin-top', 20);
			mText.css('margin-bottom', 20);
			mTextArea.append(mText);
		}
	}

	function createLoadingText() {
		var mLoadingText = $('<div id="mLoadingText">正在加载中. . .</div>');
		mTextArea.append(mLoadingText);
	}

	var mTextPages, nowPage = 0;
	//$.getJSON("https://nero19960329.github.io/json/commentdata.json", function(json) {
	$.getJSON("json/commentdata.json", function(json) {
		mTextPages = json.commentpages[arg.id];
		if (mTextPages != 0) {;
			//$.getJSON("https://nero19960329.github.io/json/commentdata_" + arg.id + "_0.json", function(json) {
			$.getJSON("json/commentdata_" + arg.id + "_0.json", function(json) {
				$('#mLoadingText').remove();
				createmText(json);
				var mPrePageButton = $('<div>上一页</div>');
				mPrePageButton.css('position', 'absolute');
				mPrePageButton.css('left', parseInt(mTextArea.css('width')) * 0.5 - 60);
				mPrePageButton.css('top', 450);
				mPrePageButton.css('cursor', 'pointer');
				mPrePageButton.bind({
					mouseup: function() {
						if (nowPage > 0) {
							--nowPage;
						} else if (nowPage == 0) {
							return;
						}
						createLoadingText();
						$('#mNowPage').html('<div id="mNowPage">' + (nowPage + 1) + ' / ' + mTextPages + ' 页</div>');
						$('.mText').remove();
						//$.getJSON("https://nero19960329.github.io/json/commentdata_" + arg.id + "_" + nowPage + ".json", function(json) {
						$.getJSON("json/commentdata_" + arg.id + "_" + nowPage + ".json", function(json) {
							$('#mLoadingText').remove();
							createmText(json);
						}).fail(function() {
							$('#mLoadingLoadText').remove();
							setCommentErrorText();
						});
					}
				});
				var mNextPageButton = $('<div>下一页</div>');
				mNextPageButton.css('position', 'absolute');
				mNextPageButton.css('left', parseInt(mTextArea.css('width')) * 0.5 + 60);
				mNextPageButton.css('top', 450);
				mNextPageButton.css('cursor', 'pointer');
				mNextPageButton.bind({
					mouseup: function() {
						if (nowPage < mTextPages - 1) {
							++nowPage;
						} else {
							return;
						}
						createLoadingText();
						$('#mNowPage').html('<div id="mNowPage">' + (nowPage + 1) + ' / ' + mTextPages + ' 页</div>');
						$('.mText').remove();
						//$.getJSON("https://nero19960329.github.io/json/commentdata_" + arg.id + "_" + nowPage + ".json", function(json) {
						$.getJSON("json/commentdata_" + arg.id + "_" + nowPage + ".json", function(json) {
							$('#mLoadingText').remove();
							createmText(json);
						}).fail(function() {
							$('#mLoadingLoadText').remove();
							setCommentErrorText();
						});
					}
				});
				var mNowPage = $('<div id="mNowPage">' + (nowPage + 1) + ' / ' + mTextPages + ' 页</div>');
				mNowPage.css('position', 'absolute');
				mNowPage.css('left', parseInt(mTextArea.css('width')) * 0.5 - 5);
				mNowPage.css('top', 450);
				mTextArea.append(mNowPage);
				mTextArea.append(mPrePageButton);
				mTextArea.append(mNextPageButton);
			});
		} else {
			$('#mLoadingText').remove();
			var mText = $('<div>暂时还没有评论哦~</div>');
			mText.css('margin-top', 20);
			mText.css('margin-bottom', 20);
			mTextArea.append(mText);
		}
	}).fail(function() {
		setCommentErrorText();
	});

	function openWindow() {
		mWindow.css('display', 'block');
		mWindow.animate({
			width: mWindowWidth * 1.05,
			height: mWindowHeight * 1.05,
			left: (windowWidth - mWindowWidth * 1.05) / 2,
			top: mWindowTop * 0.95,
		}, 150, function() {
			if (isError(mPhoto) == false) {
				debugger;
				mPhoto.css('display', 'block');
			}
		});

		mWindow.animate({
			width: mWindowWidth,
			height: mWindowHeight,
			left: mWindowLeft,
			top: mWindowTop,
		}, 100, function() {
			mCloseButton.css('display', 'block');
			mPhotoArea.css('display', 'block');
		});
	}

	function closeWindow() {
		mPhoto.remove();
		mTextArea.remove();
		mWindow.animate({
			width: 0,
			height: 0,
			left: windowWidth / 2,
			top: windowHeight / 2,
		}, 150, function() {
			mWindow.remove();
		});
		fog.remove();
	}

	function setCommentErrorText() {
		var mCommentErrorText = $('<div id="mCommentErrorText">正在加载中. . .</div>');
		mTextArea.append(mCommentErrorText);
	}
}