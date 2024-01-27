var colors = [];
var grid = [];
var cols = 100;
var rows = 50;
var cellSize = 0;

function makeGrid() {
    let grid = [];
    for (let x = 0; x < cols; x++) {
        grid[x] = [];
        for (let y = 0; y < rows; y++) {
            grid[x][y] = 0;
        }
    }
    return grid;
}

function remakeGrid() {
    let newGrid = [];
    for (let x = 0; x < cols; x++) {
        newGrid[x] = [];
        for (let y = 0; y < rows; y++) {
            if (grid[x][y] != null) newGrid[x][y] = grid[x][y];
            else newGrid[x][y] = 0;
        }
    }
    return newGrid;
}

function setup() {
    // createCanvas(2490, 1245);
    cellSize = windowWidth / cols;
    createCanvas(windowWidth, windowHeight - cellSize * 3.5);

    grid = makeGrid();
    colors[0] = color(168, 8, 67);
    colors[1] = color(12, 207, 122);

    makeGoButton();
}

function windowResized() {
    cellSize = windowWidth / cols;
    grid = remakeGrid();
    resizeCanvas(windowWidth, windowHeight - cellSize * 3.5);
}

var mode = 0;

function mousePressed() {
    if (go) return;
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let distance = dist(mouseX, mouseY, cellSize / 2 + i * cellSize, cellSize / 2 + j * cellSize);
            if (distance < cellSize / 2) {
                mode = grid[i][j] == 0 ? 1 : 0;
            }
        }
    }
    drawCell(mode);
}

function mouseDragged() {
    if (go) return;
    drawCell(mode);
}

function drawCell(drawMode) {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let distance = dist(mouseX, mouseY, cellSize / 2 + i * cellSize, cellSize / 2 + j * cellSize);
            if (distance < cellSize / 2) {
                grid[i][j] = drawMode;
            }
        }
    }
}

function makeGoButton() {
    let goButton = createButton("GO");

    let clearButton = createButton("CLEAR");

    goButton.mousePressed(() => {
        go = true;
        goButton.remove();
        clearButton.remove();
        makeStopButton();
    });

    clearButton.mousePressed(() => {
        grid = makeGrid();
    });
}

function makeStopButton() {
    let stopButton = createButton("STOP");

    stopButton.mousePressed(() => {
        go = false;
        stopButton.remove();

        makeGoButton();
    });
}

let go = false;

let task_done = false;
let last_done = 0;

function draw() {
    let delay = 30; //ms
    if (!task_done) {
        background("#1b1b1b");
        noStroke();
        stroke(1);
        // rectMode(CENTER);

        // draw grid
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                fill(colors[grid[i][j]]);
                rect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }

        if (go) {
            let nextGrid = makeGrid();

            // compute next grid
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    let state = grid[i][j];

                    let neighbours = countLiveNeighbours(grid, i, j);
                    let isAlive = state == 1;

                    if (isAlive) {
                        if (neighbours < 2) {
                            nextGrid[i][j] = 0;
                        } else if (neighbours == 2 || neighbours == 3) {
                            nextGrid[i][j] = 1;
                        } else if (neighbours > 3) {
                            nextGrid[i][j] = 0;
                        }
                    } else {
                        if (neighbours == 3) {
                            nextGrid[i][j] = 1;
                        }
                    }
                }
            }

            grid = nextGrid;
        }

        task_done = true;
        last_done = millis();
    } else {
        if (millis() - last_done > delay) {
            task_done = false;
        }
    }
}

function countLiveNeighbours(grid, x, y) {
    let neighbours = 0;

    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (i == 0 && j == 0) continue;
            if (x + i < 0 || x + i == cols) continue;
            if (y + j < 0 || y + j == rows) continue;
            neighbours += grid[x + i][y + j];
        }
    }

    return neighbours;
}
