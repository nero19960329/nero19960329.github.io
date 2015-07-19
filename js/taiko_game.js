var page_status = 0;		// 当前的状态，暂定 0：封面、1：选择关卡、2：开始游戏、3：分数发布
var gamearea = $('#gamearea');
var coverimage = $('<img id="coverimage" src="../src/game/cover.jpg" />');
var loadingtext = $('<div id="loadingtext">Now Loading...</div>');
gamearea.append(loadingtext);
var clickkeytext = $('<div id="clickkeytext">请点击画面</div>');

coverimage.load(function() {
	loadingtext.remove();
	gamearea.append(coverimage);
	gamearea.append(clickkeytext);
});

var background_selectstage;

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
				background_selectstage = $('<img id="bg_selectstage" src="../src/game/temp_selectstage.jpg" />')
				background_selectstage.load(function() {
					gamearea.append(background_selectstage);
					background_selectstage
					.animate({
						left: 0
					}, 500, function() {
						displaySelectstage();
					});
				});
			});
		}
	}
});
var songlist = $('<div id="songlist"></div>');
var insertSongs = new Array();
insertSongs[0] = "late in autumn";
insertSongs[1] = "紅蓮の弓矢";
insertSongs[2] = "自由の翼";
insertSongs[3] = "僕らは今のなかで";
insertSongs[4] = "きっと青春が聞こえる";
insertSongs[5] = "aLIEz";
var songAudio;

// var background_selectstage = $('<img id="bg_selectstage" src="../src/game/temp_selectstage.jpg" />')
// background_selectstage.load(function() {
// 	gamearea.append(background_selectstage);
// 	background_selectstage
// 	.animate({
// 		left: 0
// 	}, 500, function() {
// 		displaySelectstage();
// 	});
// });

function displaySelectstage() {
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

function setSonghover(index) {
	var song = $('<div id="song_' + index + '">' + insertSongs[index] + '</div>');
	song.hover(
		function(e) {
			song
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
			.animate({
				left: 10
			}, 200);
			song.css('cursor', 'default');
		}
	);
	song.bind({
		mouseup: function(e) {
			page_status = 2;
			songlistDisappear();
		}
	});
	songlist.append(song);
	song
	.delay(index * 40)
	.animate({
		left: 10	
	}, 500);
}

function songlistDisappear() {
	var songs = $('#songlist div');
	var songlength = songs.length;
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
					gamearea.append(loadingtext);
					songAudio = $('<audio id="songAudio" src="../src/game/songs/fripSide - Late in autumn.mp3" type="audio/mp3" />');
					//songAudio = $('<audio id="songAudio" src="../src/game/taiko-normal-hitnormal.wav" />');
					gamearea.append(songAudio);
					var songAudio_dom = document.getElementById("songAudio");
					songAudio.load(function() {
						songAudio_dom.play();
						deployGamewidgets();
						generateWidgets();
					});
					
					songAudio_dom.onended = function() {
						setTimeout(gametoolsDisappear, 2000);
						setTimeout(displayScore, 2500)
					};
				}
			});
		})(i);
	}
}

//page_status = 2;
var drumarea;
var drumIn;
var drumOut;
var drumMiddle;
var widgetarea;
var targetIn;
var targetBorder;
var tablecloth;
//deployGamewidgets();

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

var drum_in = new Array(20), drum_out = new Array(20), drum_in_big = new Array(20), drum_out_big = new Array(20);
for (var i = 0; i < 20; ++i) {
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
var widgetType = new Array();		// 鼓点类型，0：小红、1：小蓝、2：大红、3：大蓝
var isClicked = new Array();
var inrange = new Array();
var queuetop = 0;
var flyspeed = 0.3;					// 鼓点的飞行速度，每毫秒移动的像素数

function generateWidgets() {
	var offset = 462;
	for (var i = 0; i < 2000; ++i) {
		var randomType = parseInt(Math.random() * 4);
		(function(index) {
			widgetType[index] = randomType;
			setTimeout(setoneWidget(index, widgetType[index]), offset + (index + 4.5) * 60000 / 65 - (1280 - 70) / flyspeed + 20 * flyspeed);	// 因为人有反应时间，所以加了与飞行速度相关的延时
			setTimeout(setMiddleLine, offset + (index + 2.25) * 60000 / 32.5 - (1320 - 110) / flyspeed);
			isClicked[index] = false;
			inrange[index] = false;
		})(i);
	}
}

function setMiddleLine() {
	var targetMiddle = $('<div id="targetMiddle" />');
	gamearea.append(targetMiddle);
	targetMiddle
	.animate({
		left: 110
	}, (1320 - 110) / flyspeed, "linear", function() {
		this.remove();
	});
}

function setoneWidget(index, type) {
	// 在setTimeout函数中传递参数的方法
	return function() {
		widgetQueue[index] = $('<div class="widget" />');
		if (type === 0) {
			widgetQueue[index].css('background-image', 'url("../src/game/widget_red.jpg")');
			widgetQueue[index].css('left', 1280);
			widgetQueue[index].css('top', 190);
			widgetQueue[index].css('width', 80);
			widgetQueue[index].css('height', 80);
		} else if (type === 1) {
			widgetQueue[index].css('background-image', 'url("../src/game/widget_blue.jpg")');
			widgetQueue[index].css('left', 1280);
			widgetQueue[index].css('top', 190);
			widgetQueue[index].css('width', 80);
			widgetQueue[index].css('height', 80);
		} else if (type === 2) {
			widgetQueue[index].css('background-image', 'url("../src/game/widget_red_big.jpg")');
			widgetQueue[index].css('left', 1270);
			widgetQueue[index].css('top', 180);
			widgetQueue[index].css('width', 100);
			widgetQueue[index].css('height', 100);
		} else if (type === 3) {
			widgetQueue[index].css('background-image', 'url("../src/game/widget_blue_big.jpg")');
			widgetQueue[index].css('left', 1270);
			widgetQueue[index].css('top', 180);
			widgetQueue[index].css('width', 100);
			widgetQueue[index].css('height', 100);
		}
		gamearea.append(widgetQueue[index]);
		var wleft = parseInt(widgetQueue[index].css('left'));
		var wtop = parseInt(widgetQueue[index].css('top'));
		var wwidth = parseInt(widgetQueue[index].css('width'));
		var wheight = parseInt(widgetQueue[index].css('wheight'));
		widgetQueue[index]
		.animate({
			left: 245
		}, (wleft - 245) / flyspeed, "linear", function() {
			inrange[index] = true;
		});

		widgetQueue[index]
		.animate({
			left: 155
		}, 90 / flyspeed, "linear", function() {
			inrange[index] = false;
			if (isClicked[queuetop] === false) {
				widgetQueue[queuetop]
				.animate({
					left: 70
				}, 85 / flyspeed, "linear", function() {
					this.remove();
				});
			}
			queuetop++;
		});
	}
}

function plusinloop(i) {
	if (i < 19) {
		return i + 1;
	} else {
		return 0;
	}
}

var left_in = $('<div id="left_in"></div>');
var keys = new Array(70, 74, 68, 75);
var playinIndex = 0, playoutIndex = 0;
var combo = 0, maxCombo = 0;
var numberWidth = new Array(40, 29, 41, 38, 41, 39, 41, 38, 39, 37);
$('html').bind({
	keydown: function(e) {
		if (page_status === 2) {
			// 分别是F、J、D、K键
			for (var i = 0; i < 4; ++i) {
				if (e.keyCode === keys[i]) {
					console.log("queuetop: " + queuetop + " inrange = " + inrange[queuetop] + " type = " + widgetType[queuetop]);
					if (i < 2) {
						if (inrange[queuetop] === true) {
							isClicked[queuetop] = true;
							if (widgetType[queuetop] === 0 || widgetType[queuetop] === 2) {
								if (widgetType[queuetop] === 0) {
									document.getElementsByClassName('drum_in')[playinIndex].play();
								} else {
									document.getElementsByClassName('drum_in_big')[playinIndex].play();
								}
								widgetDisappear(queuetop);
								++queuetop;
								++combo;
								setComboText();
							} else if (widgetType[queuetop] === 1 || widgetType[queuetop] === 3) {
								widgetQueue[queuetop].remove();
								if (maxCombo < combo) {
									maxCombo = combo;
								}
								combo = 0;
								removeComboText();
							}
							inrange[queuetop] = false;
						}
						if (i === 0) {

						} else {

						}
					} else {
						if (inrange[queuetop] === true) {
							isClicked[queuetop] = true;
							if (widgetType[queuetop] === 0 || widgetType[queuetop] === 2) {
								widgetQueue[queuetop].remove();
								if (maxCombo < combo) {
									maxCombo = combo;
								}
								combo = 0;
								removeComboText();
							} else if (widgetType[queuetop] === 1 || widgetType[queuetop] === 3) {
								if (widgetType[queuetop] === 1) {
									document.getElementsByClassName('drum_out')[playinIndex].play();
								} else {
									document.getElementsByClassName('drum_out_big')[playinIndex].play();
								}
								widgetDisappear(queuetop);
								++queuetop;
								++combo;
								setComboText();
							}
							inrange[queuetop] = false;
						}
						if (i === 2) {

						} else {

						}
					}
					playinIndex = plusinloop(playinIndex);
				}
			}

			// A
			if (e.keyCode === 65) {
				/*//songAudio = $('<audio id="songAudio" src="../src/game/songs/fripSide - Late in autumn.mp3" type="audio/mp3" />');
				songAudio = $('<audio id="songAudio" src="../src/game/taiko-normal-hitnormal.wav" />');
				gamearea.append(songAudio);
				songAudio.load({
					console.log("load!");
				})
				var songAudio_dom = document.getElementById("songAudio");
				songAudio_dom.addEventListener("loadstart", function() {
					songAudio_dom.play();
					generateWidgets();
				});
				songAudio_dom.onended = function() {
					setTimeout(gametoolsDisappear, 2000);
					setTimeout(displayScore, 2500)
				};*/
			}
		}
	},

	keyup: function(e) {
		if (page_status === 2) {
			if (e.keyCode === keys[0]) {
				//left_in.remove();
			}
		}
	}
});

function removeComboText() {
	if ($('.comboText').length != 0) {
		$('.comboText').remove();
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
	removeComboText();
	var single = combo % 10, tens = ((combo - single) / 10) % 10, hundreds = ((combo - single - tens * 10) / 100) % 100;
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
		} else if (combo < 1000) {
			singleText.css('left', 75 + numberWidth[tens] / 2);
			tensText.css('left', 75 - numberWidth[tens] / 2);
			var hundredsText = $('<img class="comboText" src="../src/game/score-' + hundreds + '.png" />');
			hundredsText.css('width', numberWidth[hundreds]);
			hundredsText.css('height', 0);
			hundredsText.css('top', 260);
			hundredsText.css('left', 75 - numberWidth[tens] / 2 - numberWidth[hundreds]);
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
	widgetQueue[qtop]
	.stop()
	.animate({
		top: 90,
		opacity: 0.8
	}, 200, "easeOutQuart", function() {
		widgetQueue[qtop].css('z-index', 20);
	});
	widgetQueue[qtop]
	.animate({
		left: 20,
		top: 467,
		opacity: 0
	}, 500, "easeInQuad", function() {
		widgetQueue[qtop].remove();
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
	for (var i = 0; i < 20; ++i) {
		drum_in[i].remove();
		drum_out[i].remove();
		drum_in_big[i].remove();
		drum_out_big[i].remove();
	}
	songAudio.remove();
}

function getDigits(num) {
	var digits = new Array(6);
	var count = 0;
	for (var i = 0; i < 6; ++i) {
		digits[i] = num % 10;
		num = parseInt(num / 10);
	}
	return digits;
}

var score = 290644;
//var numberWidth = new Array(40, 29, 41, 38, 41, 39, 41, 38, 39, 37);
var finalscoreArea;
var finalscore;
var detailArea;
var backButton;
//displayScore();
function displayScore() {
	finalscoreArea = $('<div id="finalscoreArea">Score</div>');
	finalscore = new Array(6);
	detailArea = $('<div id="detailArea">Results</div>');
	backButton = $('<div id="backButton">返回</div>');
	
	gamearea.append(finalscoreArea);
	gamearea.append(detailArea);
	gamearea.append(backButton);
	finalscoreArea
	.animate({
		left: 0
	}, 500, function() {
		var digits = getDigits(score);
		var nowleft = 180;
		for (var i = 5; i >= 0; --i) {
			finalscore[i] = $('<img class="finalscore" src="../src/game/score-' + digits[i] + '.png" />');
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
			for (var i = 0; i < 6; ++i) {
				finalscore[i].remove();
			}
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
				background_selectstage = $('<img id="bg_selectstage" src="../src/game/temp_selectstage.jpg" />')
				background_selectstage.load(function() {
					gamearea.append(background_selectstage);
					background_selectstage
					.animate({
						left: 0
					}, 500, function() {
						displaySelectstage();
					});
				});
			});
		}
	});
}