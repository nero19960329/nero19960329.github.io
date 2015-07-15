var fileLength = 0, stepLength;
var srcFileName = new Array();
var naturalWidth = new Array();
var naturalHeight = new Array();
var imageLatitude = new Array();
var imageLongitude = new Array();
var nowHeight = new Array(4);
var scrollFlag = false;			// false表示还没加载完，true表示已经加载完
var locallatitude, locallongitude, locationFlag = false;
var jsonNum = 1, jsonMax = 3;

for (var i = 0; i < 4; ++i) {
	nowHeight[i] = 0;
}

$('header').css('margin-left', ($(window).width() - $('h1').width()) / 2);

if (navigator.geolocation) {
	console.log("geolocation ok!");
	navigator.geolocation.getCurrentPosition(locationSuccess, locationError, {
        enableHighAcuracy: true,
        timeout: 5000,
        maximumAge: 3000
    });

	function locationError(error) {
		switch(error.code){
           case error.TIMEOUT:
                console.log('超时');
                break;
           case error.PERMISSION_DENIED:
                console.log('用户拒绝提供地理位置');
                break;
           case error.POSITION_UNAVAILABLE:
                console.log('地理位置不可用');
                break;
           default:
                break;
      }
	};

    function locationSuccess(position) {
    	locationFlag = true;
        // 估算的纬度 -90~90
        locallatitude = position.coords.latitude;
        // 估算的经度 -180~180
        locallongitude = position.coords.longitude;
    };
}

function getDistance(A, B) {
	//debugger;
	var PI = 3.1415926;
	var p1 = A.latitude * PI / 180, p2 = B.latitude * PI / 180;
	var a1 = A.longitude * PI / 180, a2 = B.longitude * PI / 180;
	var x1 = Math.cos(p1) * Math.cos(a1);
	var x2 = Math.cos(p2) * Math.cos(a2);
	var y1 = Math.cos(p1) * Math.sin(a1);
	var y2 = Math.cos(p2) * Math.sin(a2);
	var z1 = Math.sin(p1);
	var z2 = Math.sin(p2);
	var angle = Math.acos(x1 * x2 + y1 * y2 + z1 * z2);
	var Radius = 6371;
	var distance = angle * Radius;
	return distance;
}

function setBottomLoadText() {
	var mBottomLoadText = $('<div id="mBottomLoadText"><img src="src/waterfall_loading.gif" style="width: 20px; height: 20px;"/>正在加载中. . .</div>');
	mBottomLoadText.css('position', 'absolute');
	mBottomLoadText.css('left', $(window).width() / 2 - 50);
	mBottomLoadText.css('top', $('html').height() - 50);
	$('html').append(mBottomLoadText);
}

function setBottomErrorText() {
	var mBottomLoadText = $('<div id="mBottomLoadText"><img src="src/waterfall_loading.gif" style="width: 20px; height: 20px;"/>正在加载中. . .</div>');
	mBottomLoadText.css('position', 'absolute');
	mBottomLoadText.css('left', $(window).width() / 2 - 50);
	mBottomLoadText.css('top', $('html').height() - 50);
	$('html').append(mBottomLoadText);
}

function extractNum(str) {
	return parseInt(str.replace(/[^0-9]/ig,""));
}

function getMinIndex() {
	var index = 0;
	for (var i = 1; i < 4; ++i) {
		if (nowHeight[i] < nowHeight[index]) {
			index = i;
		}
	}
	return index;
}

function initialize(json) {
	for (var k = 0; k < stepLength; ++k) {
		var i = parseInt(json.images[k].id);
		var r = getMinIndex();
		var allArea = $('<li class="allArea"></li>');
		var photoArea = $('<div class="photoArea" id="photoArea_' + i + '"></div>');
		var photo = $('<img class="stream_photo" id="photo_' + i + '" src="src/thumbnail/' + srcFileName[i] + '" />');
		photo.css('display', 'none');
		var rWidth;
		if ($('body').width() <= 800) {
			rWidth = 120;
		} else {
			rWidth = $('body').width() * 0.16;
		}
		var changedHeight = naturalHeight[i];
		if (naturalWidth[i] < rWidth) {
			nowHeight[r] += changedHeight;
		} else {
			changedHeight = naturalHeight[i] * rWidth / naturalWidth[i];
			if (changedHeight > 500) {
				changedHeight = 500;
			}
			nowHeight[r] += changedHeight;
		}
		allArea.append(photoArea);
		photoArea.append(photo);
		$($('#stream .row')[r]).append(allArea);
	}
	var count = stepLength;
	$("img").load(function() {
		--count;
		if (count != 0) {
			return;
		}
		setPartWidgets(json);

		var start = parseInt(json.images[0].id), end = parseInt(json.images[stepLength - 1].id);
		for (var k = 0; k < fileLength; ++k) {
			var photo = $($('.photoArea')[k]);
			$('#mTopLoadText').remove();
			$('#mBottomLoadText').remove();
			$($('.stream_photo')[k]).css('display', 'block');
			var index = extractNum(photo.attr('id'));
			if (start > index || index > end) {
				continue;
			}
			(function(ind) {
				photo.bind({
					mouseup: function(e) {
						if (e.which == 1) {
							new DisplayWindow({
								id: ind, 
								width: naturalWidth[ind], 
								height: naturalHeight[ind], 
								srcPath: srcFileName[ind],
								latitude: imageLatitude[ind],
								longitude: imageLongitude[ind]
							});
						}
					}
				});
			})(index);
		}
		scrollFlag = true;
	});
}

//$.getJSON("https://nero19960329.github.io/json/srcdata_0.json", function(json) {
$.getJSON("json/srcdata_0.json", function(json) {
	stepLength = json.images.length;
	fileLength += stepLength;
	for (var k = 0; k < stepLength; ++k) {
		var i = parseInt(json.images[k].id);
		srcFileName[i] = json.images[i].name;
		naturalWidth[i] = parseInt(json.images[i].width);
		naturalHeight[i] = parseInt(json.images[i].height);
		imageLatitude[i] = parseInt(json.images[i].latitude);
		imageLongitude[i] = parseInt(json.images[i].longitude);
	}
	var stream = $('#stream');
	var rows = $('.row');
	for (var i = 0; i < rows.length; ++i) {
		if ($('body').width() <= 1024) {
			$(rows[i]).css('width', 120);
		}
	}
	initialize(json);
});

$(window).bind({
	scroll: function() {
		var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
		if (scrollFlag == true && scrollTop > $('html').height() - $(window).height() - 500) {
			if (jsonNum <= jsonMax) {
				scrollFlag = false;
				setBottomLoadText();
				//$.getJSON("https://nero19960329.github.io/json/srcdata_" + jsonNum + ".json", function(json) {
				$.getJSON("json/srcdata_" + jsonNum + ".json", function(json) {
					stepLength = json.images.length;
					fileLength += stepLength;
					for (var k = 0; k < stepLength; ++k) {
						var i = parseInt(json.images[k].id);
						srcFileName[i] = json.images[k].name;
						naturalWidth[i] = parseInt(json.images[k].width);
						naturalHeight[i] = parseInt(json.images[k].height);
						imageLatitude[i] = parseInt(json.images[k].latitude);
						imageLongitude[i] = parseInt(json.images[k].longitude);
					}
					initialize(json);
				});
				++jsonNum;
			}
		}
	}
});

function setRows() {
	$('#stream').css('margin-left', $('body').width() * 0.06);
	var rows = $('.row');
	for (var i = 0; i < rows.length; ++i) {
		if ($('body').width() <= 800) {
			$(rows[i]).css('width', 120);
		} else {
			$(rows[i]).css('width', parseInt($('body').width() * 0.22 - 40));
		}
	}
}

function setAllWidgets() {
	setRows();
	var rowWidth = parseInt($('#stream .row').css('width'));
	for (var i = 0; i < fileLength; ++i) {
		var photo = $($('.stream_photo')[i]);
		var index = extractNum(photo.attr('id'));
		if (naturalWidth[index] < rowWidth) {
			photo.css('margin-left', (rowWidth - naturalWidth[index]) / 2);
			photo.css('margin-right', (rowWidth - naturalWidth[index]) / 2);
		} else {
			photo.css('width', rowWidth);
		}

		if (photo.height() > 500) {
			$($('#stream .row .allArea')[i]).css('height', 500);
		} else {
			$($('#stream .row .allArea')[i]).css('height', photo.height());
		}
	}
}

function setPartWidgets(json) {
	setRows();
	var rowWidth = parseInt($('#stream .row').css('width'));
	var start = parseInt(json.images[0].id), end = parseInt(json.images[stepLength - 1].id);
	for (var k = 0; k < fileLength; ++k) {
		var photo = $($('.stream_photo')[k]);
		var index = extractNum(photo.attr('id'));
		if (start > index || index > end) {
			continue;
		}
		if (naturalWidth[index] < rowWidth) {
			photo.css('margin-left', (rowWidth - naturalWidth[index]) / 2);
			photo.css('margin-right', (rowWidth - naturalWidth[index]) / 2);
		} else {
			photo.css('width', rowWidth);
		}

		if (photo.height() > 500) {
			$($('#stream .row .allArea')[k]).css('height', 500);
		} else {
			$($('#stream .row .allArea')[k]).css('height', photo.height());
		}
	}
}

$(window).resize(function() {
	setAllWidgets();
});