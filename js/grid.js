var LIVE = true;
var DEAD = false;

function Grid(width, height) {
	this.width = width;
	this.height = height;
	this.grid = new Array(width);
	for (var i = 0; i < width; ++i) {
		this.grid[i] = new Array(height);
		for (var j = 0; j < height; ++j) {
			this.grid[i][j] = DEAD;
		}
	}
}

var WIDTH = 0, HEIGHT = 0, SPEED = 1000;
var myGrid = new Grid(WIDTH, HEIGHT);
