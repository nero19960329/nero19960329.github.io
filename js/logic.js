var functionId;

var Grid = require("./grid.js");
var LIVE = Grid.LIVE;
var DEAD = Grid.DEAD;
var WALL = Grid.WALL;

// 设置随机网格
function setRandomGrid(selfGrid, dense) {
    var width = selfGrid.width, height = selfGrid.height;
    while(true) {
        var allGrid = width * height;
        var liveGrid = 0;
        for (var i = 0; i < width; ++i) {
            for (var j = 0; j < height; ++j) {
                var randomNumber = Math.random();
                if (randomNumber <= dense) {
                    selfGrid.grid[i][j] = LIVE;
                    ++liveGrid;
                } else {
                    selfGrid.grid[i][j] = DEAD;
                }
            }
        }
        if (liveGrid / allGrid >= (dense - 0.005) && liveGrid / allGrid <= (dense + 0.005)) {
            break;
        }
    }
}

function update_color(selfGrid) {
	update(selfGrid);
	colorGrid();
}

function update(selfGrid){
    var width = selfGrid.width, height = selfGrid.height;
    var tempGrid = new Grid(width, height);
    var neighborLiveCount = 0;
    for(var i = 0; i < width; i++) {
        for(var j = 0; j < height; j++) {
        	if (selfGrid.grid[i][j] === WALL) {
        		tempGrid.grid[i][j] = WALL
        		continue;
        	}

            neighborLiveCount = get_neighbor_count(i, j, selfGrid);
            if(neighborLiveCount == 3) {
                tempGrid.grid[i][j] = LIVE;
            }
            else if(neighborLiveCount == 2) {
                tempGrid.grid[i][j] = selfGrid.grid[i][j];
            }
            else {
                tempGrid.grid[i][j] = DEAD;
            }
        }
    }

    for(var i = 0; i < width; i++) {
        for(var j = 0; j < height; j++) {
            selfGrid.grid[i][j] = tempGrid.grid[i][j];
        }
    }
}

function get_neighbor_count(x, y, selfGrid) {
    var width = selfGrid.width, height = selfGrid.height;
    var direction = [[-1, 0], [-2, 0], [1, 0], [2, 0], [0, 1], [0, 2], [0, -1], [0, -2]];
    var neightborLiveCount = 0;
    var destinationX, destinationY;
    for(var i = 0; i < 8; i++){
        destinationX = x + direction[i][0];
        destinationY = y + direction[i][1];
        if(destinationX < 0 || destinationX >= width || destinationY < 0 || destinationY >= height) {
            continue;
        }
        if(selfGrid.grid[destinationX][destinationY] == LIVE) {
            neightborLiveCount++;
        }
        if(neightborLiveCount >= 4) {
        	return 4;
        }
    }
    return neightborLiveCount;
}

function start(selfGrid, interval) {
    functionId = setInterval(function() {
        update_color(selfGrid)
    }, interval);
}

function pause() {
    window.clearInterval(functionId);
}

module.exports.setRandomGrid = setRandomGrid;
module.exports.get_neighbor_count = get_neighbor_count;
module.exports.update = update;
