var displayGrid;
var width, height;
var windowWidth, windowHeight;
var isRunning = false, isPrepared = false;
var displayWidth, displayHeight, unitWidth, unitHeight;

// 设置样式
function setAllArea() {
	$("#allArea").css("margin-left", (windowWidth - $("#allArea").width()) / 2);
}

function colorGrid() {
	var ctx = $("#gridCanvas")[0].getContext("2d");
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.fillRect(0, 0, displayWidth, displayHeight);
	for (var i = 0; i < width; ++i) {
		for (var j = 0; j < height; ++j) {
			if (myGrid.grid[i][j] === DEAD) {
				ctx.fillStyle = "rgb(0, 0, 0)";
			} else if (myGrid.grid[i][j] === WALL) {
				ctx.fillStyle = "rgb(255, 0, 0)";
			} else {
				ctx.fillStyle = "rgb(255, 255, 255)";
			}
			ctx.fillRect(unitWidth * i, unitHeight * j, unitWidth, unitHeight);
		}
	}

	for (var i = 0; i <= width; ++i) {
		ctx.beginPath();
		ctx.moveTo(i * unitWidth, 0);
		ctx.lineTo(i * unitWidth, displayHeight);
		ctx.strokeStyle = "blue"
		ctx.stroke();
	}

	for (var j = 0; j <= height; ++j) {
		ctx.beginPath();
		ctx.moveTo(0, j * unitHeight);
		ctx.lineTo(displayWidth, j * unitHeight);
		ctx.strokeStyle = "blue"
		ctx.stroke();
	}
}

function setLiveDense() {
	var live_dense = parseInt($("input[name='live_dense']").val());
	LIVE_DENSE = live_dense / 100;
}

function setDense() {
	var dense = parseInt($("input[name='dense']").val());
	WIDTH = parseInt(dense / 4) * 4;
	HEIGHT = WIDTH * 3 / 4;
	
	if (width != WIDTH || height != HEIGHT) {
		myGrid = new Grid(WIDTH, HEIGHT);
		width = myGrid.width;
		height = myGrid.height;
	}
}

function setSpeed() {
	var speed = parseInt($("input[name='speed']").val());
	SPEED = 1000 / speed;
}

function setWall() {
	var canvas = $("#gridCanvas")[0];
	if (typeof(canvas) === "undefined") {
		return;
	}
	canvas.addEventListener("click", function(e) {
		if (isRunning === true) {
			return;
		}

		var rect = canvas.getBoundingClientRect();
		var x = e.clientX - rect.left * (canvas.width / rect.width);
		var y = e.clientY - rect.top * (canvas.height / rect.height);
		var i = parseInt(x / unitWidth), j = parseInt(y / unitHeight);
		myGrid.grid[i][j] = WALL;
		colorGrid();
	}, false);
}

function generateMap() {
	if (isRunning === true) {
		return;
	}
	setDense();
	setLiveDense();
	setRandomGrid(myGrid, LIVE_DENSE);
	displayWidth = $("#gridCanvas").width();
	displayHeight = $("#gridCanvas").height();
	unitWidth = displayWidth / width;
	unitHeight = displayHeight / height;
	colorGrid();
	isPrepared = true;
}

function startButton() {
	if (isPrepared === false) {
		alert("请先生成地图！");
		return;
	}
	if (isRunning === true) {
		return;
	}

	$("input").attr("disabled", true);
	setSpeed();
	console.log("LIVE_DENSE: " + LIVE_DENSE + " WIDTH: " + WIDTH + " HEIGHT: " + HEIGHT + " SPEED: " + SPEED);
	isRunning = true;
	start(myGrid, SPEED);
}

function stopButton() {
	$("input").attr("disabled", false);
	pause();
	isRunning = false;
}

$(window).resize(function() {
	windowWidth = $(window).width();
	windowHeight = $(window).height();
	setAllArea();
});

$(document).ready(function() {
	width = myGrid.width;
	height = myGrid.height;
	windowWidth = $(window).width();
	windowHeight = $(window).height();

	setAllArea();
	//setDense();
	//setRandomGrid(LIVE_DENSE);
	displayWidth = $("#gridCanvas").width();
	displayHeight = $("#gridCanvas").height();
	unitWidth = displayWidth / width;
	unitHeight = displayHeight / height;
	//colorGrid();

	setWall();
});
