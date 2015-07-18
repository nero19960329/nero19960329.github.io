var page_status = 0;		// 当前的状态，暂定 0：封面、1：选择关卡、2：开始游戏

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
				})
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
//displaySelectstage();

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
			deployGamewidgets();
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
		var flydistance = parseInt($(songs[i]).css('left')) + parseInt($(songs[i]).css('width'));
		// 从上往下依次飞出 采用了delay方法
		$(songs[i])
		.stop(true, true)
		.delay(i * 40)
		.animate({
			left: -flydistance
		}, 200, function() {
			this.remove();
		});
	}
}

function deployGamewidgets() {

}