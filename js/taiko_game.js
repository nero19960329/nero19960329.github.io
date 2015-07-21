var page_status = 0;		// 当前的状态，暂定 0：封面、1：选择关卡、1.5：载入中、2：开始游戏、3：分数发布
var gamearea = $('#gamearea');
var coverimage = $('<img id="coverimage" src="../src/game/cover.jpg" />');
var loadingtext = $('<div id="loadingtext">Now Loading...</div>');
gamearea.append(loadingtext);
var clickkeytext = $('<div id="clickkeytext"></div>');

var helpInformation = new Array();
helpInformation[0] = "建议佩戴耳机进行游玩";
helpInformation[1] = "红色鼓点对应F、J按键，蓝色鼓点对应D、K按键，黄色鼓点条可以交替持续敲击D、F、J、K中的任意键";

coverimage.load(function() {
	loadingtext.remove();
	gamearea.append(coverimage);
	gamearea.append(clickkeytext);
});

var background_selectstage;
var songdata = new Array();

$('#gamearea').bind({
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
						$.getJSON("https://nero19960329.github.io/json/game/songs/" + jsonName[0] + ".json", function(json) {
							loadingtext.remove();
							songdata[0] = json;
							displaySelectstage();
							setSongDetail(0);
							nowSongIndex = 0;
						}).fail(function() {

						});
					});
				});
			});
		}
	}
});
var songlist = $('<div id="songlist"></div>');
var insertSongs = new Array();
insertSongs[0] = "Brave Shine (TV Size)";
insertSongs[1] = "Sister's noise(TV Size)";
insertSongs[2] = "硝子の花園";
insertSongs[3] = "Butter-Fly(TV Size)";
insertSongs[4] = "No Brand Girls";
insertSongs[5] = "God Knows";
var jsonName = new Array();
jsonName[0] = "braveshine";
jsonName[1] = "fripSide-sister'snoise";
jsonName[2] = "NanjouYoshinoKusudaAina-GarasunoHanazono";
jsonName[3] = "WadaKouji-Butter-Fly";
jsonName[4] = "u's-Nobrandgirls";
jsonName[5] = "HiranoAya-Godknows";
var songType = new Array();
songType[0] = "mp3";
songType[1] = "mp3";
songType[2] = "mp3";
songType[3] = "mp3";
songType[4] = "mp3";
songType[5] = "ogg";
var songAudio, tryAudio, tryAudioIndex;

var songDetailArea;
var autoCheckbox;
var difficultyButtons = new Array(4);

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

var autoFlag, nowSongIndex;

function setSongDetail(index) {
	var song = $('<div id="song_' + index + '">' + insertSongs[index] + '</div>');
	$('.difficultyButtons').remove();
	gamearea.append(loadingtext);
	$.getJSON("https://nero19960329.github.io/json/game/songs/" + jsonName[index] + ".json", function(json) {
		loadingtext.remove();
		$('.difficultyButtons').remove();
		songdata[index] = json;
		songDetailArea.html("Information:<br />" + song.html() + "<br /> —— " + songdata[index].subtitle + "<br />author：" + songdata[index].author + "<br />artist：" + songdata[index].artist + "<br /><div id='autoDiv'><input type='checkbox' id='autoCheckbox' value='auto' />auto</div>");
		var bg = $('<img id="bg_selectstage" src="../src/game/cover/' + songdata[index].wave + '.jpg" />');
		gamearea.append(loadingtext);
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

		$('.tryAudio').remove(); 
		tryAudioIndex = index;
		tryAudio = $('<audio class="tryAudio" id="tryAudio_' + tryAudioIndex + '" src="../src/game/songs/' + songdata[index].wave + '.' + songType[index] + '" />');
		gamearea.append(tryAudio);
		var tryAudio_dom = document.getElementsByClassName("tryAudio")[0];
		tryAudio_dom.oncanplaythrough = function() {
			if ($($('.tryAudio')[0]).attr('id') === 'tryAudio_' + tryAudioIndex) {
				console.log($($('.tryAudio')[0]).attr('id'));
				this.currentTime = parseInt(songdata[index].demostart / 1000);
				this.play();
			}
		};
		tryAudio_dom.onended = function() {
			this.currentTime = parseInt(songdata[index].demostart / 1000);
			this.play();
		}
	}).fail(function() {

	});
}

function setSonghover(index) {
	var song = $('<div id="song_' + index + '">' + insertSongs[index] + '</div>');
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
var combo, maxCombo, fcFlag;
var perfectCount, goodCount, wrongCount;
var score, basicScore, fullScore;
var loadingProgress, loadingWindow, OKText;
var OKFlag;
var selectedSongIndex, selectedButtonIndex;

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
					$('#songlist').remove();
					loadingProgress = $('<progress value="0" max="100"></progress>');
					//debugger;
					loadingWindow = $('<div id="loadingWindow">' + insertSongs[songIndex] + '<br />artist: ' + songdata[songIndex].artist + '<br /><br />红色鼓点对应F、J按键，蓝色鼓点对应D、K按键<br />黄色鼓点条可以交替持续敲击D、F、J、K中的任意键</div>');
					OKFlag = false;
					gamearea.append(loadingProgress);
					gamearea.append(loadingWindow);

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
							var count_icon = 13;
							var widgetIcon = new Array(8);
							for (var j = 0; j < 13; ++j) {
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
							for (var j = 0; j < 13; ++j) {
								gamearea.append(widgetIcon[j]);
							}
							$('.LoadingIcon').load(function() {
								--count_icon;
								loadingProgress.attr('value', 40 + (13 - count_icon) * 2);
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
										if (fcFlag === true) {

										}
										setTimeout(gametoolsDisappear, 2000);
										setTimeout(displayScore, 2500)
									};
								}
							});
						}
					});
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

var widgetQueue = new Array();
var widgetType = new Array();		// 鼓点类型，0：小红、1：小蓝、2：大红、3：大蓝、4：黄
var isClicked = new Array();
var isError = new Array();
var inrange = new Array();
var queuetop;
var flyspeed = new Array(0.3, 0.5, 0.7, 0.9);					// 鼓点的飞行速度，每毫秒移动的像素数
var drum_icon;

function generateWidgets(songIndex, buttonIndex) {
	$.getJSON("https://nero19960329.github.io/json/game/detail/" + jsonName[songIndex] + (buttonIndex + 1) + ".json", function(json) {
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
		console.log("fullScore: " + fullScore);

		drum_icon = $('<div id="drum_icon" />');
		gamearea.append(drum_icon);

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

	});
}

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

var hits_yellow;
function setoneWidget(index, type, json, difficulty) {
	// 在setTimeout函数中传递参数的方法
	return function() {
		widgetQueue[index] = $('<div class="widget" />');
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
				inrange[index] = 1;
			});
			widgetQueue[index]
			.animate({
				left: 225
			}, 20 / flyspeed[difficulty], "linear", function() {
				inrange[index] = 2;
			});
			widgetQueue[index]
			.animate({
				left: 195
			}, 30 / flyspeed[difficulty], "linear", function() {
				console.log(document.getElementById("songAudio").currentTime);
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
				if (autoFlag === true) {
					var e = jQuery.Event("keyup");
					if (type === 0 || type === 2) {
						e.keyCode = index % 2;
					} else {
						e.keyCode = 2 + (index % 2);
					}
					$('html').trigger(e);
				}
				inrange[index] = 1;
			});
			widgetQueue[index]
			.animate({
				left: 155
			}, 20 / flyspeed[difficulty], "linear", function() {
				if (isClicked[index] === false || isError[index] === true) {
					wrongCount++;
					if (isError[index] === false) {
						setMissIcon();
					}
					fcFlag = false;
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
		} else {
			//widgetQueue[index].css('background-image', 'url("../src/game/widget_yellow.jpg")');
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
					if (maxCombo < combo) {
						maxCombo = combo;
					}
					wrongCount++;
					setMissIcon();
					fcFlag = false;
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
		if (page_status === 1.5 && OKFlag === true && e.keyCode === 13) {
			$('#tryAudio').remove();
			page_status = 2;
			loadingProgress.remove();
			loadingWindow.remove();
			deployGamewidgets();
			combo = 0;
			maxCombo = 0;
			fcFlag = true;
			perfectCount = 0;
			goodCount = 0;
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
									goodCount++;
								} else {
									console.log("perfect");
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
							} else if (widgetType[queuetop] === 1 || widgetType[queuetop] === 3) {
								isError[queuetop] = true;
								wrongCount++;
								setMissIcon();
								fcFlag = false;
								if (widgetType[queuetop] === 1) {
									widgetQueue[queuetop].css('background-image', 'url(../src/game/widget_error.png)');
								} else {
									widgetQueue[queuetop].css('background-image', 'url(../src/game/widget_error_big.png)');
								}
								if (maxCombo < combo) {
									maxCombo = combo;
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
								fcFlag = false;
								if (widgetType[queuetop] === 0) {
									widgetQueue[queuetop].css('background-image', 'url(../src/game/widget_error.png)');
								} else {
									widgetQueue[queuetop].css('background-image', 'url(../src/game/widget_error_big.png)');
								}
								if (maxCombo < combo) {
									maxCombo = combo;
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
									goodCount++;
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

function widgetDisappear(qtop) {
	if (widgetQueue[qtop].is(":animated")) {
		widgetQueue[qtop]
		.stop(true)
		.animate({
			top: 90,
			opacity: 0.8
		}, 200, "easeOutQuart", function() {
			widgetQueue[qtop].css('z-index', 20);
		});
	} else {
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

function FadeOut(obj) {
	obj.animate({
		opacity: 0
	}, 500, function() {
		this.remove();
	});
}

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
	$('#Ranking').remove();
}

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
var perfectText, goodText, wrongText, maxComboText, rankingText, ranking;
function displayScore() {
	finalscoreArea = $('<div id="finalscoreArea">Score</div>');
	finalscore = new Array(6);
	detailArea = $('<div id="detailArea">Results</div>');
	backButton = $('<div id="backButton">返回</div>');
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

	backButton.bind({
		mouseup: function(e) {
			page_status = 1;
			$('.finalscore').remove();
			$('#rankingText').remove();
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