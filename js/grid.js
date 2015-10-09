var LIVE = 1;
var DEAD = 0;
var WALL = -1;

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

var WIDTH = 200, HEIGHT = 150, SPEED = 1000, LIVE_DENSE = 0.5;
var myGrid = new Grid(WIDTH, HEIGHT);

module.exports = Grid;
module.exports.LIVE = LIVE;
module.exports.DEAD = DEAD;
module.exports.WALL = WALL;
