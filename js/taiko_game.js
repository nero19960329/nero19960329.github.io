var page_status = 0;		// 当前的状态，暂定 0：封面、1：选择关卡、2：开始游戏
var gamearea = $('#gamearea');
/*var coverimage = $('<img id="coverimage" src="../src/game/cover.jpg" />');
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
				console.log("callback!!");
				console.log("index = " + index + " songlength = " + songlength);
				this.remove();
				if (index == songlength - 1) {
					$('#songlist').remove();
					deployGamewidgets();
				}
			});
		})(i);
	}
}*/

page_status = 2;
var drumarea = $('<div id="drumarea" />');
var drumIn = $('<div id="drumIn" />');
var drumOut = $('<div id="drumOut" />');
var drumMiddle = $('<div id="drumMiddle" />');
var widgetarea = $('<div id="widgetarea" />');
var targetIn = $('<div id="targetIn" />');
var targetBorder = $('<div id="targetBorder" />');
var tablecloth = $('<div id="tablecloth" />')
deployGamewidgets();

function deployGamewidgets() {
	gamearea.append(drumarea);
	gamearea.append(drumOut);
	gamearea.append(drumIn);
	gamearea.append(drumMiddle);
	gamearea.append(widgetarea);
	gamearea.append(targetIn);
	gamearea.append(targetBorder);
	gamearea.append(tablecloth);
}

var drum_in = new Array(20), drum_out = new Array(20);
for (var i = 0; i < 20; ++i) {
	drum_in[i] = $('<audio class="drum_in" src="../src/game/taiko-normal-hitnormal.wav" />');
	drum_out[i] = $('<audio class="drum_out" src="../src/game/taiko-normal-hitclap.wav" />');
	gamearea.append(drum_in[i]);
	gamearea.append(drum_out[i]);
}

var widget;

var left_in = $('<div id="left_in"></div>');
var keys = new Array(70, 74, 68, 75);
var playinIndex = 0, playoutIndex = 0;
$('html').bind({
	keydown: function(e) {
		if (page_status === 2) {
			// 分别是F、J、D、K键
			for (var i = 0; i < 4; ++i) {
				if (e.keyCode === keys[i]) {
					if (i < 2) {
						document.getElementsByClassName('drum_in')[playinIndex].play();
						if (i === 0) {

						} else {

						}
					} else {
						document.getElementsByClassName('drum_out')[playinIndex].play();
						if (i === 2) {

						} else {

						}
					}
					if (playinIndex < 19) {
						++playinIndex;
					} else {
						playinIndex = 0;
					}
				}
			}

			// A
			if (e.keyCode === 65) {
				widget = $('<div class="widget" />');
				gamearea.append(widget);
				widget
				.animate({
					left: 70
				}, 2000, "linear", function() {
					this.remove();
				});
			}

			// S
			if (e.keyCode === 83) {
				console.log(widget.css('left'));
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