var functionId;

function update_color(selfGrid) {
	update(selfGrid);
	colorGrid();
}

function update(selfGrid){
    var tempGrid = new Grid(selfGrid.width, selfGrid.height);
    var neighborLiveCount = 0;
    for(var i = 0; i < selfGrid.width; i++) {
        for(var j = 0; j < selfGrid.height; j++) {
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

    for(var i = 0; i < selfGrid.width; i++) {
        for(var j = 0; j < selfGrid.height; j++) {
            selfGrid.grid[i][j] = tempGrid.grid[i][j];
        }
    }
}

function get_neighbor_count(x, y, selfGrid) {
    var direction = [[-1, 0], [-2, 0], [1, 0], [2, 0], [0, 1], [0, 2], [0, -1], [0, -2]];
    var neightborLiveCount = 0;
    var destinationX, destinationY;
    for(var i = 0; i < 8; i++){
        destinationX = x + direction[i][0];
        destinationY = y + direction[i][1];
        if(destinationX < 0 || destinationX >= selfGrid.width || destinationY < 0 || destinationY >= selfGrid.height) {
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