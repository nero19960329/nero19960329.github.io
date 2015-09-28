var displayGrid;
var width = myGrid.width, height = myGrid.height;
var windowWidth = $(window).width(), windowHeight = $(window).height();

// 设置随机网格
function setRandomGrid() {
	for (var i = 0; i < width; ++i) {
		for (var j = 0; j < height; ++j) {
			var randomNumber = Math.random();
			if (randomNumber <= 0.5) {
				myGrid.grid[i][j] = DEAD;
			} else {
				myGrid.grid[i][j] = LIVE;
			}
		}
	}
}

// 设置样式
function setAllArea() {
	$("#allArea").css("margin-left", (windowWidth - $("#allArea").width()) / 2);
}

function colorGrid() {
	var displayWidth = $("#gridCanvas").width(), displayHeight = $("#gridCanvas").height();
	var unitWidth = displayWidth / width, unitHeight = displayHeight / height;
	var ctx = $("#gridCanvas")[0].getContext("2d");
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.fillRect(0, 0, displayWidth, displayHeight);
	ctx.fillStyle = "rgb(0, 0, 0)";
	for (var i = 0; i < width; ++i) {
		for (var j = 0; j < height; ++j) {
			if (myGrid.grid[i][j] === DEAD) {
				ctx.fillRect(unitWidth * i, unitHeight * j, unitWidth, unitHeight);
			}
		}
	}
}

function setDense() {
	var dense = $("input:radio[name='dense']:checked").val();
	if (dense === "low") {
		WIDTH = 60;
		HEIGHT = 45;
	} else if (dense === "medium") {
		WIDTH = 120;
		HEIGHT = 90;
	} else {
		WIDTH = 200;
		HEIGHT = 150;
	}
	
	if (width != WIDTH || height != HEIGHT) {
		myGrid = new Grid(WIDTH, HEIGHT);
		width = myGrid.width;
		height = myGrid.height;
		setRandomGrid();
	} else {
		setRandomGrid();
	}
}

function setSpeed() {
	var speed = $("input:radio[name='speed']:checked").val();
	if (speed === "low") {
		SPEED = 400;
	} else if (speed === "medium") {
		SPEED = 240;
	} else {
		SPEED = 80;
	}
}

function startButton() {
	$("input").attr("disabled", true);
	setDense();
	setSpeed();
	colorGrid();
	start(myGrid, SPEED);
}

function stopButton() {
	$("input").attr("disabled", false);
	pause();
}

$(window).resize(function() {
	windowWidth = $(window).width();
	windowHeight = $(window).height();
	setAllArea();
});

$(document).ready(function() {
	setAllArea();
	setDense();
	colorGrid();
});
