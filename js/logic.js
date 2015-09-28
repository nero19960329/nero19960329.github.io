var numLowerLimit = 0.4;
var numUpperLimit = 0.6;
var functionId;

// function set_live_cell(selfGrid){
//     var x, y;
//     numScope = numUpperLimit - numLowerLimit;
//     if(numScope <= 0){
//         return false;
//     }
//     var RandomNum  = Math.floor((Math.random() * numScope + numLowerLimit) * selfGrid.width * selfGrid.height);
//     //console.log(RandomNum);
//     for(var i = 0; i < RandomNum; i++){
//         do{
//             x = Math.floor(width*Math.random());
//             y = Math.floor(height*Math.random());
//         }while(selfGrid.grid[x][y] != DEAD)
//         selfGrid.grid[x][y] = LIVE;
//         //console.log(x + " " + y);
//     }
//     return selfGrid;
// }

function update(selfGrid){
    var tempGrid = new Grid(selfGrid.width, selfGrid.height);
    var neighborLiveCount = 0;
    for(var i = 0; i < selfGrid.width; i++){
        for(var j = 0; j < selfGrid.height; j++){
            neighborLiveCount = get_neighbor_count(i, j, selfGrid);
            if(neighborLiveCount == 3){
                tempGrid.grid[i][j] = LIVE;
            }
            else if(neighborLiveCount == 2){
                tempGrid.grid[i][j] = selfGrid.grid[i][j];
            }
            else{
                tempGrid.grid[i][j] = DEAD;
            }
        }
    }

    for(var i = 0; i < selfGrid.width; i++){
        for(var j = 0; j < selfGrid.height; j++){
            selfGrid.grid[i][j] = tempGrid.grid[i][j];
        }
    }
    //show_grid(selfGrid);
    
    colorGrid();
}

function get_neighbor_count(x, y, selfGrid){
    var direction = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
    var neightborLiveCount = 0;
    var destinationX, destinationY;
    for(var i = 0; i < 8; i++){
        destinationX = x + direction[i][0];
        destinationY = y + direction[i][1];
        if(destinationX < 0 || destinationX >= selfGrid.width || destinationY < 0 || destinationY >= selfGrid.height){
            continue;
        }
        if(selfGrid.grid[destinationX][destinationY] == LIVE){
            neightborLiveCount++;
        }
        if(neightborLiveCount >= 4) return 4;
    }
    return neightborLiveCount;
}

function start(selfGrid, interval){
    //functionId = setInterval(update(selfGrid), interval);
    functionId = setInterval(function() {
        update(selfGrid)
    }, interval);
}

function pause(){
    window.clearInterval(functionId);
}

// 调试用函数，可以忽略掉
// function show_grid(selfGrid){
//     for(var i = 0; i < selfGrid.width; i++){
//         for(var j = 0; j < selfGrid.height; j++){
//             console.log(selfGrid.grid[i][j] + " ");
//         }
//         console.log("\n");
//     }
//     console.log("\n");
// }