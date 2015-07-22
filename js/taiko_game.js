var page_status = 0;		// 当前的状态，暂定 0：封面、1：选择关卡、1.5：载入中、2：开始游戏、3：分数发布
var gamearea = $('#gamearea');
var coverimage = $('<img id="coverimage" src="../src/game/cover.jpg" />');
var loadingtext = $('<div id="loadingtext">Now Loading...</div>');
gamearea.append(loadingtext);
var clickkeytext = $('<div id="clickkeytext"></div>');

// 封面图加载完成
coverimage.load(function() {
	loadingtext.remove();
	gamearea.append(coverimage);
	gamearea.append(clickkeytext);
});

var background_selectstage;
var songdata = new Array();	// 存储歌曲信息的数组

$('#gamearea').bind({
	// 点击进入选择关卡界面
	mouseup: function() {
		if (page_status === 0) {
			clickkeytext.remove();
			// 封面图向左飞出
			coverimage.animate({
				left: -1280
			}, 500, function() {
				coverimage.remove();
				page_status = 1;
				background_selectstage = $('<img id="bg_selectstage" src="../src/game/cover/brave shine.jpg" />');
				gamearea.append(loadingtext);
				background_selectstage.load(function() {
					gamearea.append(background_selectstage);
					background_selectstage
					.animate({
						left: 0
					}, 500, function() {
						// 读取默认歌曲的数据
						$.getJSON("https://nero19960329.github.io/json/game/songs/" + jsonName[0] + ".json", function(json) {
							loadingtext.remove();
							songdata[0] = json;
							displaySelectstage();
							setSongDetail(0);
							nowSongIndex = 0;
						}).fail(function() {
							alert("读取失败！请检查网络");
						});
					});
				});
			});
		}
	}
});
var songlist = $('<div id="songlist"></div>');
// 歌曲名
var insertSongs = new Array();
insertSongs[0] = "Brave Shine (TV Size)";
insertSongs[1] = "Sister's noise(TV Size)";
insertSongs[2] = "硝子の花園";
insertSongs[3] = "Butter-Fly(TV Size)";
insertSongs[4] = "No Brand Girls";
insertSongs[5] = "God Knows";
// 歌曲的json文件名
var jsonName = new Array();
jsonName[0] = "braveshine";
jsonName[1] = "fripSide-sister'snoise";
jsonName[2] = "NanjouYoshinoKusudaAina-GarasunoHanazono";
jsonName[3] = "WadaKouji-Butter-Fly";
jsonName[4] = "u's-Nobrandgirls";
jsonName[5] = "HiranoAya-Godknows";
// 歌曲的后缀
var songType = new Array();
songType[0] = "mp3";
songType[1] = "mp3";
songType[2] = "mp3";
songType[3] = "mp3";
songType[4] = "mp3";
songType[5] = "ogg";

// 分别代表完整的歌曲和试听的歌曲
var songAudio, tryAudio;

var songDetailArea;
var autoCheckbox;
var difficultyButtons = new Array(4);

// 显示选择关卡的界面
function displaySelectstage() {
	songDetailArea = $('<div id="songDetailArea" ></div>');
	gamearea.append(songDetailArea);
	for (var i = 0; i < insertSongs.length; ++i) {
		setSonghover(i);
	}
	gamearea.append(songlist);
	var songs = $('#songlist div');
	var songlength = songs.length;
	for (var i = 0; i < songlength; ++i) {
		$(songs[i]).css('z-index', (i + 1));
		if (i < songlength / 2) {
			$(songs[i]).css('width', 375 + 50 * i / songlength);
		} else {
			$(songs[i]).css('width', 375 + 50 * (songlength - 1 - i) / songlength);
		}
		$(songs[i]).css('top', i * 70);
	}
}

// autoFlag即是否是自动打歌
// nowSongIndex即当前选中歌曲的id
var autoFlag, nowSongIndex;

// 设置歌曲的具体信息界面
function setSongDetail(index) {
	var song = $('<div id="song_' + index + '">' + insertSongs[index] + '</div>');
	$('.difficultyButtons').remove();
	gamearea.append(loadingtext);
	// 读取歌曲对应的json数据
	$.getJSON("https://nero19960329.github.io/json/game/songs/" + jsonName[index] + ".json", function(json) {
		loadingtext.remove();
		$('.difficultyButtons').remove();
		songdata[index] = json;
		songDetailArea.html("Information:<br />" + song.html() + "<br /> —— " + songdata[index].subtitle + "<br />author：" + songdata[index].author + "<br />artist：" + songdata[index].artist + "<br /><div id='autoDiv'><input type='checkbox' id='autoCheckbox' value='auto' />auto</div>");
		var bg = $('<img id="bg_selectstage" src="../src/game/cover/' + songdata[index].wave + '.jpg" />');
		gamearea.append(loadingtext);
		// 背景图读取完毕后进行替换，这样不会出现背景图在一段时间内没有的情况
		bg.load(function() {
			background_selectstage.remove();
			background_selectstage = bg;
			loadingtext.remove();
			background_selectstage.css('left', 0);
			gamearea.append(background_selectstage);
		})
		difficultyButtons[0] = $('<div class="difficultyButtons">Easy</div>');
		difficultyButtons[1] = $('<div class="difficultyButtons">Normal</div>');
		difficultyButtons[2] = $('<div class="difficultyButtons">Hard</div>');
		difficultyButtons[3] = $('<div class="difficultyButtons">Expert</div>');
		for (var i = 0; i < 4; ++i) {
			difficultyButtons[i].css('top', 85 + 60 * i);
			(function(buttonIndex) {
				// 点击关卡难易度按钮进入加载界面
				difficultyButtons[i].bind({
					mouseup: function() {
						page_status = 1.5;
						autoFlag = ($('#autoCheckbox').attr('checked') === 'checked');
						songlistDisappear(index, buttonIndex);
					}
				});
			})(i);
			gamearea.append(difficultyButtons[i]);
		}

		// 防止快速更换歌曲而导致的试听部分同时播放，所以在播放之前先把以前的试听部分删除掉
		$('.tryAudio').remove(); 
		tryAudio = $('<audio class="tryAudio" " src="../src/game/songs/' + songdata[index].wave + '.' + songType[index] + '" />');
		gamearea.append(tryAudio);
		var tryAudio_dom = document.getElementsByClassName("tryAudio")[0];
		// 设置歌曲的播放时间，实现从高潮部分开始播放
		tryAudio_dom.currentTime = parseInt(songdata[index].demostart / 1000);
		tryAudio_dom.play();
		// 手动循环
		tryAudio_dom.onended = function() {
			this.currentTime = parseInt(songdata[index].demostart / 1000);
			this.play();
		}
	}).fail(function() {
		alert("读取失败！请检查网络");
	});
}

// 设置鼠标悬停在歌曲列表上时的动画
function setSonghover(index) {
	var song = $('<div id="song_' + index + '">' + insertSongs[index] + '</div>');
	// 为防止鼠标多次悬停在列表上导致的动画连续播放，在每次触发动画前会调用stop(true)，以此来停止被选元素的所有加入队列的动画
	song.hover(
		function(e) {
			song
			.stop(true)
			.animate({
				left: 40
			}, 150);
			song
			.animate({
				left: 30
			}, 100);
			song.css('cursor', 'pointer');
		},

		function(e) {
			song
			.stop(true)
			.animate({
				left: 10
			}, 200);
			song.css('cursor', 'default');
		}
	);
	song.bind({
		mouseup: function(e) {
			// 如果换了歌曲，才进行读取数据
			if (index != nowSongIndex) {
				nowSongIndex = index;
				setSongDetail(index);
			}
		}
	});
	songlist.append(song);
	song
	.delay(index * 40)
	.animate({
		left: 10	
	}, 500);
}

var combo;	// 连击数
var perfectCount, greatCount, wrongCount;	// perfect数、great数、miss数
var score, basicScore, fullScore;			// 当前得分、基础得分、这首歌的满分
var loadingProgress, loadingWindow, OKText;
var OKFlag;									// 是否已经加载完毕
var selectedSongIndex, selectedButtonIndex;

// 设置加载的窗口
function setLoadingWindow(songIndex, buttonIndex, index) {
	$('#songlist').remove();
	loadingProgress = $('<progress value="0" max="100"></progress>');
	loadingWindow = $('<div id="loadingWindow">' + insertSongs[songIndex] + '<br />artist: ' + songdata[songIndex].artist + '<br /><br />红色鼓点对应F、J按键，蓝色鼓点对应D、K按键<br />黄色鼓点条可以交替持续敲击D、F、J、K中的任意键</div>');
	OKFlag = false;
	gamearea.append(loadingProgress);
	gamearea.append(loadingWindow);

	// 载入得分的图片
	var count_image = 20;
	var scoreImage = new Array(10), comboImage = new Array(10);
	for (var j = 0; j < 10; ++j) {
		(function(index) {
			scoreImage[index] = $('<img class="LoadingImage" src="../src/game/default-' + index + '.png" />');
			comboImage[index] = $('<img class="LoadingImage" src="../src/game/score-' + index + '.png" />');
			gamearea.append(scoreImage[index]);
			gamearea.append(comboImage[index]);
		})(j);
	}
	$('.LoadingImage').load(function() {
		--count_image;
		loadingProgress.attr('value', (20 - count_image) * 2);
		if (count_image == 0) {
			// 载入鼓点、ranking等图片
			var count_icon = 16;
			var widgetIcon = new Array(8);
			for (var j = 0; j < 16; ++j) {
				widgetIcon[j] = $('<img class="LoadingIcon" />');
			}
			widgetIcon[0].attr('src', '../src/game/widget_red.png');
			widgetIcon[1].attr('src', '../src/game/widget_blue.png');
			widgetIcon[2].attr('src', '../src/game/widget_red_big.png');
			widgetIcon[3].attr('src', '../src/game/widget_blue_big.png');
			widgetIcon[4].attr('src', '../src/game/left_in.png');
			widgetIcon[5].attr('src', '../src/game/right_in.png');
			widgetIcon[6].attr('src', '../src/game/left_out.png');
			widgetIcon[7].attr('src', '../src/game/right_out.png');
			widgetIcon[8].attr('src', '../src/game/ranking-C.png');
			widgetIcon[9].attr('src', '../src/game/ranking-B.png');
			widgetIcon[10].attr('src', '../src/game/ranking-A.png');
			widgetIcon[11].attr('src', '../src/game/ranking-S.png');
			widgetIcon[12].attr('src', '../src/game/ranking-X.png');
			widgetIcon[13].attr('src', '../src/game/widgetarea.png');
			widgetIcon[14].attr('src', '../src/game/drum_icon.png');
			widgetIcon[15].attr('src', '../src/game/widget_yellow.png');
			for (var j = 0; j < 16; ++j) {
				gamearea.append(widgetIcon[j]);
			}
			$('.LoadingIcon').load(function() {
				--count_icon;
				loadingProgress.attr('value', 40 + (14 - count_icon) * 2);
				if (count_icon == 0) {
					songAudio = $('<audio id="songAudio" src="../src/game/songs/' + songdata[songIndex].wave + '.' + songType[songIndex] + '" />')
					gamearea.append(songAudio);
					var songAudio_dom = document.getElementById("songAudio");

					// canplaythrough 指该音频可以无缓冲地流畅播放
					songAudio_dom.oncanplaythrough = function() {
						OKFlag = true;
						OKText = $('<div id="OKText">点击回车进入游戏</div>');
						gamearea.append(OKText);
						loadingProgress.attr('value', 100);
						selectedButtonIndex = buttonIndex;
						selectedSongIndex = songIndex;
					};
					
					songAudio_dom.onended = function() {
						setTimeout(gametoolsDisappear, 2000);
						setTimeout(displayScore, 2500)
					};
				}
			});
		}
	});
}

// 歌单消失
function songlistDisappear(songIndex, buttonIndex) {
	var songs = $('#songlist div');
	var songlength = songs.length;
	songDetailArea.remove();
	for (var i = 0; i < 4; ++i) {
		difficultyButtons[i].remove();
	}
	for (var i = 0; i < songlength; ++i) {
		(function(index) {
			var flydistance = parseInt($(songs[index]).css('left')) + parseInt($(songs[index]).css('width'));
			// 从上往下依次飞出 采用了delay方法
			$(songs[index])
			.stop(true, true)
			.delay(index * 40)
			.animate({
				left: -flydistance
			}, 200, function() {
				this.remove();
				if (index == songlength - 1) {
					setLoadingWindow(songIndex, buttonIndex, index);
				}
			});
		})(i);
	}
}

var drumarea;
var drumIn;
var drumOut;
var drumMiddle;
var widgetarea;
var targetIn;
var targetBorder;
var tablecloth;

// 部署游戏部件
function deployGamewidgets() {
	drumarea = $('<div id="drumarea" />');
	drumIn = $('<div id="drumIn" />');
	drumOut = $('<div id="drumOut" />');
	drumMiddle = $('<div id="drumMiddle" />');
	widgetarea = $('<div id="widgetarea" />');
	targetIn = $('<div id="targetIn" />');
	targetBorder = $('<div id="targetBorder" />');
	tablecloth = $('<div id="tablecloth" />');
	gamearea.append(drumarea);
	gamearea.append(drumOut);
	gamearea.append(drumIn);
	gamearea.append(drumMiddle);
	gamearea.append(widgetarea);
	gamearea.append(targetIn);
	gamearea.append(targetBorder);
	gamearea.append(tablecloth);
}

// 有可能会出现鼓点很密集从而导致一个audio播放不过来的情况，这里每种鼓点设置10个，以循环播放即可
var drum_in = new Array(10), drum_out = new Array(10), drum_in_big = new Array(10), drum_out_big = new Array(10);
for (var i = 0; i < 10; ++i) {
	drum_in[i] = $('<audio class="drum_in" src="../src/game/taiko-normal-hitnormal.wav" />');
	drum_out[i] = $('<audio class="drum_out" src="../src/game/taiko-normal-hitclap.wav" />');
	drum_in_big[i] = $('<audio class="drum_in_big" src="../src/game/taiko-normal-hitfinish.wav" />');
	drum_out_big[i] = $('<audio class="drum_out_big" src="../src/game/taiko-normal-hitwhistle.wav" />');
	gamearea.append(drum_in[i]);
	gamearea.append(drum_out[i]);
	gamearea.append(drum_in_big[i]);
	gamearea.append(drum_out_big[i]);
}

var widgetQueue = new Array();		// 鼓点存储为一个数组，与队列类似，需要维护一个队列头的变量
var widgetType = new Array();		// 鼓点类型，0：小红、1：小蓝、2：大红、3：大蓝、4：黄
var isClicked = new Array();		// 鼓点是否已经被点击过
var isError = new Array();			// 鼓点是否按错
var inrange = new Array();			// 判定区域的变量：0代表未进入判定区、1代表great判定区、2代表perfect判定区
var queuetop;						// 鼓点队列的头
var flyspeed = new Array(0.3, 0.5, 0.7, 0.9);					// 鼓点的飞行速度，每毫秒移动的像素数
var drum_icon;

function generateWidgets(songIndex, buttonIndex) {
	// 取得该歌的鼓点json数据
	$.getJSON("https://nero19960329.github.io/json/game/detail/" + jsonName[songIndex] + (buttonIndex + 1) + ".json", function(json) {
		// 估算这首歌的最大得分（不一定准，但是差不多，因为黄条得分是不定的）
		fullScore = 0;
		var length = json.widgets.length, bs = 0;
		for (var i = 0; i < length; ++i) {
			if (i % 100 === 0) {
				bs += 100;
			}
			if (json.widgets[i].type != 4) {
				fullScore += bs;
			} else {
				fullScore += Math.floor((parseInt(json.widgets[i].end) - parseInt(json.widgets[i].start) - 100) / 100) * (bs / 10);
			}
		}

		drum_icon = $('<div id="drum_icon" />');
		gamearea.append(drum_icon);

		// 两种情况：先放歌后出鼓点、先出鼓点后放歌，都需要计算延迟时间
		queuetop = 0;
		if (1085 / flyspeed[buttonIndex] - parseInt(json.widgets[0].start) > 0) {
			setTimeout("document.getElementById('songAudio').play()", (1085 / flyspeed[buttonIndex] - parseInt(json.widgets[0].start)));
			for (var i = 0; i < length; ++i) {
				(function(index) {
					widgetType[index] = parseInt(json.widgets[index].type);
					setTimeout(setoneWidget(index, widgetType[index], json, buttonIndex), parseInt(json.widgets[index].start) - parseInt(json.widgets[0].start));
					isClicked[index] = false;
					isError[index] = false;
					inrange[index] = 0;
				})(i);
			}
			var lastTime = parseInt(json.widgets[length - 1].start);
			var offset = parseInt(json.widgets[0].start);
			var middleCount = (lastTime - offset) * parseFloat(songdata[songIndex].bpm) / 60000;
			for (var i = 0; i < middleCount / 4; ++i) {
				(function(index) {
					setTimeout(setMiddleLine(buttonIndex), index * 60000 * 4 / parseFloat(songdata[songIndex].bpm));
				})(i);
			}
		} else {
			document.getElementById('songAudio').play();
			for (var i = 0; i < length; ++i) {
				(function(index) {
					widgetType[index] = parseInt(json.widgets[index].type);
					setTimeout(setoneWidget(index, widgetType[index], json, buttonIndex), parseInt(json.widgets[index].start) - 1085 / flyspeed[buttonIndex]);
					isClicked[index] = false;
					isError[index] = false;
					inrange[index] = 0;
				})(i);
			}
			var lastTime = parseInt(json.widgets[length - 1].start);
			var offset = parseInt(songdata[songIndex].offset);
			var middleCount = (lastTime - offset) * parseFloat(songdata[songIndex].bpm) / 60000;
			for (var i = 0; i < middleCount / 4; ++i) {
				(function(index) {
					if (offset + (index * 60000 * 4 / parseFloat(songdata[songIndex].bpm)) - 1085 / flyspeed[buttonIndex] < 0) {
						return;
					}
					setTimeout(setMiddleLine(buttonIndex), offset + (index * 60000 * 4 / parseFloat(songdata[songIndex].bpm)) - 1085 / flyspeed[buttonIndex]);
				})(i);
			}
		}

	}).fail(function() {
		alert("读取失败！请检查网络");
	});
}

// 设置小节线
function setMiddleLine(difficulty) {
	return function() {
		var targetMiddle = $('<div id="targetMiddle" />');
		gamearea.append(targetMiddle);
		targetMiddle
		.animate({
			left: 110
		}, (1320 - 110) / flyspeed[difficulty], "linear", function() {
			this.remove();
		});
	}
}

var hits_yellow;	// 自动模式中黄色鼓点的交替敲击
// 设置鼓点，包括样式、动画
function setoneWidget(index, type, json, difficulty) {
	// 在setTimeout函数中传递参数的方法
	return function() {
		widgetQueue[index] = $('<div class="widget" />');
		// 非黄条的情况
		if (type != 4) {
			if (type === 0) {
				widgetQueue[index].css('background-image', 'url("../src/game/widget_red.png")');
				widgetQueue[index].css('left', 1280);
				widgetQueue[index].css('top', 195);
				widgetQueue[index].css('width', 80);
				widgetQueue[index].css('height', 80);
			} else if (type === 1) {
				widgetQueue[index].css('background-image', 'url("../src/game/widget_blue.png")');
				widgetQueue[index].css('left', 1280);
				widgetQueue[index].css('top', 195);
				widgetQueue[index].css('width', 80);
				widgetQueue[index].css('height', 80);
			} else if (type === 2) {
				widgetQueue[index].css('background-image', 'url("../src/game/widget_red_big.png")');
				widgetQueue[index].css('left', 1270);
				widgetQueue[index].css('top', 185);
				widgetQueue[index].css('width', 100);
				widgetQueue[index].css('height', 100);
			} else if (type === 3) {
				widgetQueue[index].css('background-image', 'url("../src/game/widget_blue_big.png")');
				widgetQueue[index].css('left', 1270);
				widgetQueue[index].css('top', 185);
				widgetQueue[index].css('width', 100);
				widgetQueue[index].css('height', 100);
			}

			gamearea.append(widgetQueue[index]);
			var wleft = parseInt(widgetQueue[index].css('left'));
			widgetQueue[index]
			.animate({
				left: 245
			}, (wleft - 245) / flyspeed[difficulty], "linear", function() {
				// 进入great判定区
				inrange[index] = 1;
			});
			widgetQueue[index]
			.animate({
				left: 225
			}, 20 / flyspeed[difficulty], "linear", function() {
				// 进入perfect判定区
				inrange[index] = 2;
			});
			widgetQueue[index]
			.animate({
				left: 195
			}, 30 / flyspeed[difficulty], "linear", function() {
				// 如果是自动打歌，那么模拟键盘事件
				if (autoFlag === true) {
					var e = jQuery.Event("keydown");
					if (type === 0 || type === 2) {
						e.keyCode = index % 2;
					} else {
						e.keyCode = 2 + (index % 2);
					}
					$('html').trigger(e);
				}
			});
			widgetQueue[index]
			.animate({
				left: 175
			}, 20 / flyspeed[difficulty], "linear", function() {
				// 如果是自动打歌，那么模拟键盘事件
				if (autoFlag === true) {
					var e = jQuery.Event("keyup");
					if (type === 0 || type === 2) {
						e.keyCode = index % 2;
					} else {
						e.keyCode = 2 + (index % 2);
					}
					$('html').trigger(e);
				}
				// 进入great判定区
				inrange[index] = 1;
			});
			widgetQueue[index]
			.animate({
				left: 155
			}, 20 / flyspeed[difficulty], "linear", function() {
				// 没打这个鼓点或者打错了
				if (isClicked[index] === false || isError[index] === true) {
					wrongCount++;
					if (isError[index] === false) {
						setMissIcon();
					}
					inrange[index] = 0;
					widgetQueue[index]
					.animate({
						left: 70
					}, 85 / flyspeed[difficulty], "linear", function() {
						this.remove();
					});
					queuetop++;
					combo = 0;
					basicScore = 100;
					$('.comboText').remove();
				}
			});
		} else {		// 黄色鼓点条的情况
			widgetQueue[index].css('background-color', 'rgb(243, 242, 57)');
			widgetQueue[index].css('left', 1280);
			widgetQueue[index].css('top', 195);
			widgetQueue[index].css('width', (json.widgets[index].end - json.widgets[index].start) * flyspeed[difficulty]);
			widgetQueue[index].css('height', 80);
			widgetQueue[index].css('border-radius', 40);

			var yellowWidget = $('<div class="widget" />');
			yellowWidget.css('background-image', 'url("../src/game/widget_yellow.png")');
			yellowWidget.css('left', 1280);
			yellowWidget.css('top', 195);
			yellowWidget.css('width', 80);
			yellowWidget.css('height', 80);
			yellowWidget.css('border-radius', 40);
			yellowWidget.css('z-index', 9);

			gamearea.append(yellowWidget);
			gamearea.append(widgetQueue[index]);
			var wleft = parseInt(widgetQueue[index].css('left'));
			var wwidth = parseInt(widgetQueue[index].css('width'));
			widgetQueue[index]
			.animate({
				left: 235
			}, (wleft - 235) / flyspeed[difficulty], "linear", function() {
				inrange[index] = 2;
				if (autoFlag === true) {
					hits_yellow = setInterval(twohits(0, 1), 200);
				}
			});
			widgetQueue[index]
			.animate({
				left: 235 - wwidth
			}, wwidth / flyspeed[difficulty], "linear", function() {
				if (autoFlag === true) {
					clearInterval(hits_yellow);
				}
				inrange[index] = 0;
				widgetQueue[index]
				.animate({
					left: 70 - wwidth
				}, 160 / flyspeed[difficulty], "linear", function() {
					this.remove();
				});
				if (isClicked[index] === true) {
					++combo;
					perfectCount++;
					if (combo % 100 === 0) {
						basicScore += 100;
					}
					setComboText();

				} else {
					wrongCount++;
					setMissIcon();
					combo = 0;
					basicScore = 0;
					$('.comboText').remove();
				}
				queuetop++;
			});
			yellowWidget
			.animate({
				left: 70
			}, (1280 - 70) / flyspeed[difficulty], "linear", function() {
				this.remove();
			});
		}
	}
}

function twohits(keycode1, keycode2) {
	return function() {
		setTimeout(onehit(keycode1), 0);
		setTimeout(onehit(keycode2), 100);
	}
}

function onehit(keycode) {
	return function() {
		onehit_down(keycode);
		setTimeout(onehit_up(keycode), 10);
	}
}

function onehit_down(keycode) {
	var e = jQuery.Event("keydown");
	e.keyCode = keycode;
	$('html').trigger(e);
}

function onehit_up(keycode) {
	return function() {
		var e = jQuery.Event("keyup");
		e.keyCode = keycode;
		$('html').trigger(e);
	}
}

// 鼓点音频数组的循环
function plusinloop(i) {
	if (i < 9) {
		return i + 1;
	} else {
		return 0;
	}
}

function setPerfectIcon() {
	var perfectIcon = $('<div id="perfectIcon" />');
	gamearea.append(perfectIcon);
	perfectIcon.animate({
		left: 505,
		top: 400,
		width: 270,
		height: 80
	}, 200, function() {
		setTimeout(function() {perfectIcon.remove();}, 100);
	});
}

function setGreatIcon() {
	var greatIcon = $('<div id="greatIcon" />');
	gamearea.append(greatIcon);
	greatIcon.animate({
		left: 505,
		top: 400,
		width: 270,
		height: 80
	}, 200, function() {
		greatIcon.remove();
	});
}

function setMissIcon() {
	var missIcon = $('<div id="missIcon" />');
	gamearea.append(missIcon);
	missIcon.animate({
		left: 505,
		top: 400,
		width: 270,
		height: 80
	}, 200, function() {
		missIcon.remove();
	});
}

var left_in, right_in, left_out, right_out;
var keys = new Array(70, 74, 68, 75);
var playinIndex = 0, playoutIndex = 0;
var numberWidth = new Array(40, 29, 41, 38, 41, 39, 41, 38, 39, 37);
$('html').bind({
	keydown: function(e) {
		// 如果在加载成功后点击回车键
		if (page_status === 1.5 && OKFlag === true && e.keyCode === 13) {
			$('.tryAudio').remove();
			page_status = 2;
			loadingProgress.remove();
			loadingWindow.remove();
			deployGamewidgets();
			combo = 0;
			perfectCount = 0;
			greatCount = 0;
			wrongCount = 0;
			score = 0;
			basicScore = 100;
			$('.difficultyButtons').remove();
			setScoreText();
			$('#OKText').remove();
			generateWidgets(selectedSongIndex, selectedButtonIndex);
			return;
		}

		var keyCode;
		//如果是自动打歌，那么需要转换一下keycode，防止与实际的keycode弄混
		if (autoFlag === true) {
			if (e.keyCode < 4) {
				keyCode = keys[e.keyCode];
			} else {
				keyCode = 0;
			}
		} else {
			keyCode = e.keyCode;
		}
		if (page_status === 2) {
			// 分别是F、J、D、K键
			for (var i = 0; i < 4; ++i) {
				if (keyCode === keys[i]) {
					if (i === 0) {
						left_in = $('<div id="left_in"></div>');
						gamearea.append(left_in);
					} else if (i === 1) {
						right_in = $('<div id="right_in"></div>');
						gamearea.append(right_in);
					} else if (i === 2) {
						left_out = $('<div id="left_out"></div>');
						gamearea.append(left_out);
					} else {
						right_out = $('<div id="right_out"></div>');
						gamearea.append(right_out);
					}

					if (inrange[queuetop] > 0) {
						isClicked[queuetop] = true;
						// 如果是黄条，那么按哪种键都可以
						if (widgetType[queuetop] === 4) {
							if (i === 0 || i === 1) {
								document.getElementsByClassName('drum_in')[playinIndex].play();
							} else {
								document.getElementsByClassName('drum_out')[playinIndex].play();
							}
							playinIndex = plusinloop(playinIndex);
							yellowWidgetDisappear();
							score += (basicScore / 10);
							setScoreText();
							setPerfectIcon();
							return;
						}

						// 红色鼓点的情况
						if (i < 2) {
							if (widgetType[queuetop] === 0 || widgetType[queuetop] === 2) {
								if (widgetType[queuetop] === 0) {
									document.getElementsByClassName('drum_in')[playinIndex].play();
								} else {
									document.getElementsByClassName('drum_in_big')[playinIndex].play();
								}

								if (inrange[queuetop] === 1) {
									console.log("good");
									score += (basicScore / 2);
									setScoreText();
									greatCount++;
								} else {
									console.log("perfect");
									score += basicScore;
									setScoreText();
									perfectCount++;
									setPerfectIcon();
								}

								widgetDisappear(queuetop);
								++combo;
								// 每隔100combo，基础得分增加100
								if (combo % 100 === 0) {
									basicScore += 100;
								}
								setComboText();
								inrange[queuetop] = 0;
								++queuetop;
							} else if (widgetType[queuetop] === 1 || widgetType[queuetop] === 3) {
								isError[queuetop] = true;
								wrongCount++;
								setMissIcon();
								if (widgetType[queuetop] === 1) {
									widgetQueue[queuetop].css('background-image', 'url(../src/game/widget_error.png)');
								} else {
									widgetQueue[queuetop].css('background-image', 'url(../src/game/widget_error_big.png)');
								}
								combo = 0;
								basicScore = 100;
								$('.comboText').remove();
								inrange[queuetop] = 0;
							}
						} else {
							if (widgetType[queuetop] === 0 || widgetType[queuetop] === 2) {
								isError[queuetop] = true;
								wrongCount++;
								setMissIcon();
								if (widgetType[queuetop] === 0) {
									widgetQueue[queuetop].css('background-image', 'url(../src/game/widget_error.png)');
								} else {
									widgetQueue[queuetop].css('background-image', 'url(../src/game/widget_error_big.png)');
								}
								combo = 0;
								basicScore = 100;
								$('.comboText').remove();
								inrange[queuetop] = 0;
								//++queuetop;
							} else if (widgetType[queuetop] === 1 || widgetType[queuetop] === 3) {
								if (widgetType[queuetop] === 1) {
									document.getElementsByClassName('drum_out')[playinIndex].play();
								} else {
									document.getElementsByClassName('drum_out_big')[playinIndex].play();
								}

								if (inrange[queuetop] === 1) {
									score += (basicScore / 2);
									setScoreText();
									greatCount++;
									setGreatIcon();
								} else {
									score += basicScore;
									setScoreText();
									perfectCount++;
									setPerfectIcon();
								}

								widgetDisappear(queuetop);
								++combo;
								if (combo % 100 === 0) {
									basicScore += 100;
								}
								setComboText();
								inrange[queuetop] = 0;
								++queuetop;
							}
						}
					}
					// 更新下一次播放鼓点声音的下标
					playinIndex = plusinloop(playinIndex);
				}
			}
		}
	},

	keyup: function(e) {
		var keyCode;
		if (autoFlag === true) {
			if (e.keyCode < 4) {
				keyCode = keys[e.keyCode];
			} else {
				keyCode = 0;
			}
		} else {
			keyCode = e.keyCode;
		}
		// 按键抬起后删掉鼓上的图标
		if (page_status === 2) {
			if (keyCode === keys[0]) {
				left_in.remove();
			} else if (keyCode === keys[1]) {
				right_in.remove();
			} else if (keyCode === keys[2]) {
				left_out.remove();
			} else if (keyCode === keys[3]) {
				right_out.remove();
			}
		}
	}
});

// 设置得分的图片
function setScoreText() {
	$('.scoreText').remove();
	var digits = getDigits(score);
	var digitText = new Array(8);
	for (var i = 0; i < 8; ++i) {
		digitText[i] = $('<img class="scoreText" src="../src/game/default-' + digits[i] + '.png" />');
		digitText[i].css('left', 1230 - 41 * i);
		digitText[i].css('width', 41);
		gamearea.append(digitText[i]);
	}
}

// 设置combo增加的动画
function setComboTextAnimation(text) {
	text
	.animate({
		top: 200,
		height: 60
	}, 200, "easeOutQuad");
	text
	.animate({
		top: 210,
		height: 50
	}, 100, "easeInQuad");
}

// 设置combo的图片
function setComboText() {
	$('.comboText').remove();
	var single = combo % 10, tens = ((combo - single) / 10) % 10, hundreds = parseInt(combo / 100) % 10, thousands = parseInt(combo / 1000);
	var singleText = $('<img class="comboText" src="../src/game/score-' + single + '.png" />');
	singleText.css('width', numberWidth[single]);
	singleText.css('height', 0);
	singleText.css('top', 260);
	if (combo < 10) {
		singleText.css('left', 75 - numberWidth[single] / 2);
	} else {
		var tensText = $('<img class="comboText" src="../src/game/score-' + tens + '.png" />');
		tensText.css('width', numberWidth[tens]);
		tensText.css('height', 0);
		tensText.css('top', 260);
		if (combo < 100) {
			singleText.css('left', 75);
			tensText.css('left', 75 - numberWidth[tens]);
		} else {
			var hundredsText = $('<img class="comboText" src="../src/game/score-' + hundreds + '.png" />');
			hundredsText.css('width', numberWidth[hundreds]);
			hundredsText.css('height', 0);
			hundredsText.css('top', 260);
			hundredsText.css('left', 75 - numberWidth[tens] / 2 - numberWidth[hundreds]);
			if (combo < 1000) {
				singleText.css('left', 75 + numberWidth[tens] / 2);
				tensText.css('left', 75 - numberWidth[tens] / 2);
			} else {
				singleText.css('left', 75 + numberWidth[tens]);
				tensText.css('left', 75);
				hundredsText.css('left', 75 - numberWidth[hundreds]);
				var thousandsText = $('<img class="comboText" src="../src/game/score-' + thousands + '.png" />');
				thousandsText.css('width', numberWidth[thousands]);
				thousandsText.css('height', 0);
				thousandsText.css('top', 260);
				thousandsText.css('left', 75 - numberWidth[hundreds] - numberWidth[thousands]);
				gamearea.append(thousandsText);
				setComboTextAnimation(thousandsText);
			}
			gamearea.append(hundredsText);
			setComboTextAnimation(hundredsText);
		}
		gamearea.append(tensText);
		setComboTextAnimation(tensText);
	}
	gamearea.append(singleText);
	setComboTextAnimation(singleText);
}

// 鼓点被正确地击中时设置的动画
function widgetDisappear(qtop) {
	// 如果当前还在动画中，那么取消掉之后动画的队列
	if (widgetQueue[qtop].is(":animated")) {
		widgetQueue[qtop]
		.stop(true)
		.animate({
			top: 90,
			opacity: 0.8
		}, 200, "easeOutQuart", function() {
			widgetQueue[qtop].css('z-index', 20);
		});
	} else {	// 如果当前不在动画中，那么直接添加动画即可
		widgetQueue[qtop]
		.animate({
			top: 90,
			opacity: 0.8
		}, 200, "easeOutQuart", function() {
			widgetQueue[qtop].css('z-index', 20);
		});
	}
	widgetQueue[qtop]
	.animate({
		left: 20,
		top: 467,
		opacity: 0
	}, 500, "easeInQuad", function() {
		widgetQueue[qtop].remove();
	});
}

function yellowWidgetDisappear() {
	var yellowDisappear = $('<div class="widget" />');
	yellowDisappear.css('background-image', 'url("../src/game/widget_yellow.png")');
	yellowDisappear.css('left', 190);
	yellowDisappear.css('top', 190);
	yellowDisappear.css('width', 80);
	yellowDisappear.css('height', 80);
	yellowDisappear.css('border-radius', 40);
	yellowDisappear.css('z-index', 9);
	yellowDisappear.css('opacity', 0);
	gamearea.append(yellowDisappear);
	yellowDisappear
	.animate({
		top: 90,
		opacity: 1
	}, 200, "easeOutQuart", function() {
		yellowDisappear.css('z-index', 20);
	});
	yellowDisappear
	.animate({
		left: 20,
		top: 467,
		opacity: 0
	}, 500, "easeInQuad", function() {
		yellowDisappear.remove();
	});
}

// 渐隐效果
function FadeOut(obj) {
	obj.animate({
		opacity: 0
	}, 500, function() {
		this.remove();
	});
}

// 游戏部件消失
function gametoolsDisappear() {
	FadeOut(drumarea);
	FadeOut(drumOut);
	FadeOut(drumIn);
	FadeOut(drumMiddle);
	FadeOut(widgetarea);
	FadeOut(targetIn);
	FadeOut(targetBorder);
	$('.comboText').remove();
	$('.scoreText').remove();
	songAudio.remove();
	$('#left_in').remove();
	$('#left_out').remove();
	$('#right_in').remove();
	$('#right_out').remove();
	drum_icon.remove();
}

// 取得num的八位数字
function getDigits(num) {
	var digits = new Array(8);
	var count = 0;
	for (var i = 0; i < 8; ++i) {
		digits[i] = num % 10;
		num = parseInt(num / 10);
	}
	return digits;
}

var finalscoreArea;
var finalscore;
var detailArea;
var backButton;
var perfectTextImage, greatTextImage, wrongTextImage, rankingText, ranking;
// 设置最后的分数界面
function displayScore() {
	finalscoreArea = $('<div id="finalscoreArea">Score</div>');
	finalscore = new Array(6);
	detailArea = $('<div id="detailArea">Results</div>');
	perfectTextImage = $('<img id="perfectTextImage" src="../src/game/icon_perfect.png" />');
	greatTextImage = $('<img id="greatTextImage" src="../src/game/icon_great.png" />');
	wrongTextImage = $('<img id="wrongTextImage" src="../src/game/icon_miss.png" />');

	var perfectDigits = getDigits(perfectCount), maxdigit;
	for (var i = 3; i >= 0; --i) {
		if (i > 0 && perfectDigits[i] != 0) {
			maxdigit = i;
			break;
		} else if (i === 0) {
			maxdigit = 0;
		}
	}
	for (var i = maxdigit; i >= 0; --i) {
		var numberImage = $('<img class="comboTextImage" src="../src/game/score-' + perfectDigits[i] + '.png"/>');
		numberImage.css('left', 200 + (maxdigit - i) * 40);
		numberImage.css('top', 165);
		gamearea.append(numberImage);
		numberImage.animate({
			opacity: 1
		}, 500);
	}
	var ximage = $('<img class="comboTextImage" src="../src/game/score-x.png">');
	ximage.css('left', 200 + (maxdigit + 1) * 40);
	ximage.css('top', 165);
	gamearea.append(ximage);
	ximage.animate({
		opacity: 1
	}, 500);

	var greatDigits = getDigits(greatCount);
	for (var i = 3; i >= 0; --i) {
		if (i > 0 && greatDigits[i] != 0) {
			maxdigit = i;
			break;
		} else if (i === 0) {
			maxdigit = 0;
		}
	}
	for (var i = maxdigit; i >= 0; --i) {
		var numberImage = $('<img class="comboTextImage" src="../src/game/score-' + greatDigits[i] + '.png"/>');
		numberImage.css('left', 200 + (maxdigit - i) * 40);
		numberImage.css('top', 245);
		gamearea.append(numberImage);
		numberImage.animate({
			opacity: 1
		}, 500);
	}
	ximage = $('<img class="comboTextImage" src="../src/game/score-x.png">');
	ximage.css('left', 200 + (maxdigit + 1) * 40);
	ximage.css('top', 245);
	gamearea.append(ximage);
	ximage.animate({
		opacity: 1
	}, 500);

	var wrongDigits = getDigits(wrongCount);
	for (var i = 3; i >= 0; --i) {
		if (i > 0 && wrongDigits[i] != 0) {
			maxdigit = i;
			break;
		} else if (i === 0) {
			maxdigit = 0;
		}
	}
	for (var i = maxdigit; i >= 0; --i) {
		var numberImage = $('<img class="comboTextImage" src="../src/game/score-' + wrongDigits[i] + '.png"/>');
		numberImage.css('left', 200 + (maxdigit - i) * 40);
		numberImage.css('top', 325);
		gamearea.append(numberImage);
		numberImage.animate({
			opacity: 1
		}, 500);
	}
	ximage = $('<img class="comboTextImage" src="../src/game/score-x.png">');
	ximage.css('left', 200 + (maxdigit + 1) * 40);
	ximage.css('top', 325);
	gamearea.append(ximage);
	ximage.animate({
		opacity: 1
	}, 500);

	backButton = $('<div id="backButton">Back</div>');
	rankingText = $('<div id="rankingText"></div>');
	if (score < fullScore * 0.5) {
		rankingText.css('background-image', 'url("../src/game/ranking-C.png")');
	} else if (score < fullScore * 0.8) {
		rankingText.css('background-image', 'url("../src/game/ranking-B.png")');
	} else if (score < fullScore * 0.9) {
		rankingText.css('background-image', 'url("../src/game/ranking-A.png")');
	} else if (score < fullScore * 0.98) {
		rankingText.css('background-image', 'url("../src/game/ranking-S.png")');
	} else {
		rankingText.css('background-image', 'url("../src/game/ranking-X.png")');
	}
	ranking = $('<div id="Ranking" />');
	gamearea.append(ranking);
	gamearea.append(rankingText);
	gamearea.append(perfectTextImage);
	gamearea.append(greatTextImage);
	gamearea.append(wrongTextImage);
	rankingText
	.animate({
		opacity: 1
	}, 1000);

	gamearea.append(finalscoreArea);
	gamearea.append(detailArea);
	gamearea.append(backButton);
	finalscoreArea
	.animate({
		left: 0
	}, 500, function() {
		var digits = getDigits(score);
		var nowleft = 180;
		for (var i = 7; i >= 0; --i) {
			finalscore[i] = $('<img class="finalscore" src="../src/game/default-' + digits[i] + '.png" />');
			finalscore[i].css('left', nowleft);
			nowleft += numberWidth[digits[i]];
			gamearea.append(finalscore[i]);
		}
	});
	detailArea
	.animate({
		left: 0
	}, 500);
	backButton
	.animate({
		left: 0
	}, 500);
	perfectTextImage
	.animate({
		left: 20
	}, 500);
	greatTextImage
	.animate({
		left: 20
	}, 500);
	wrongTextImage
	.animate({
		left: 20
	}, 500);

	backButton.bind({
		mouseup: function(e) {
			page_status = 1;
			$('.finalscore').remove();
			$('#rankingText').remove();
			$('#Ranking').remove();
			$('.comboTextImage').remove();
			perfectTextImage.remove();
			greatTextImage.remove();
			wrongTextImage.remove();
			background_selectstage
			.animate({
				left: -1280
			}, 500, function() {
				this.remove();
			});
			finalscoreArea
			.animate({
				left: -650
			}, 500, function() {
				this.remove();
			});
			detailArea
			.animate({
				left: -650
			}, 500, function() {
				this.remove();
			});
			backButton
			.animate({
				left: -110
			}, 500, function() {
				this.remove();
				background_selectstage = $('<img id="bg_selectstage" src="../src/game/cover/' + songdata[selectedSongIndex].wave + '.jpg" />')
				background_selectstage.load(function() {
					gamearea.append(background_selectstage);
					background_selectstage
					.animate({
						left: 0
					}, 500, function() {
						$.getJSON("https://nero19960329.github.io/json/game/songs/" + jsonName[selectedSongIndex] + ".json", function(json) {
							loadingtext.remove();
							songdata[0] = json;
							displaySelectstage();
							setSongDetail(selectedSongIndex);
						}).fail(function() {

						});
					});
				});
			});
		}
	});
}