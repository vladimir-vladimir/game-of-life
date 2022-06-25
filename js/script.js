const NUM_ROW = 100; //134;
const NUM_COL = 150; //252;
const tableGridBinary = Array(NUM_ROW).fill().map(()=>Array(NUM_COL).fill());
let startPressed = false;
let timeBetweenSteps = 200;
let gameStartTimer;

document.querySelector
// Buttons
startButton = document.createElement("button");
startButton.innerText = "Start";
startButton.addEventListener("click", () => {
    if (startPressed == true) {
        return;
    }
    startPressed = true;
    runGame();
});
document.querySelector("#game-buttons").append(startButton);

stopButton = document.createElement("button");
stopButton.innerText = "Stop";
stopButton.addEventListener("click", stopGame);
document.querySelector("#game-buttons").append(stopButton);

resetButton = document.createElement("button");
resetButton.innerText = "Reset";
resetButton.addEventListener("click", resetGame);
document.querySelector("#game-buttons").append(resetButton);

// Table Grid
let height = width = Math.min((document.querySelector("#game").offsetHeight -
    document.querySelector("#game-buttons").offsetHeight)*1.0/NUM_ROW,
    document.querySelector("#game").offsetWidth*1.0/NUM_COL);
const tableGrid = document.querySelector("#game-table-grid");
tableGrid.style.height = height * NUM_ROW + "px";
tableGrid.style.width = width * NUM_COL + "px";
for (let i=0; i<NUM_ROW; i++) {
    const tableRow = document.createElement("div");
    tableRow.id = `${i}`;
    tableGrid.append(tableRow);
    for (let j=0; j<NUM_COL; j++) {
        const tableItem = document.createElement("div");
        tableItem.style.height = height - 1 + "px";
        tableItem.style.width = width - 1 + "px";
        tableItem.classList.add("cell");
        tableItem.id = `${i} ${j}`;
        tableItem.addEventListener("click", tableItemClick);
        if (i<=1 || j<=1 || i>=NUM_ROW-2 || j>=NUM_COL-2) {
            tableItem.style.visibility = "hidden";
        }
        tableRow.append(tableItem);
    }
}

// Functions
function tableItemClick(el) {
    if (startPressed == true) {
        return;
    }
    if (el.target.style.backgroundColor == "black") {
        el.target.style.backgroundColor = "white";
    } else {
        el.target.style.backgroundColor = "black";
    }
}

function tableGridToArray() {
    for (let i=0; i<NUM_ROW; i++) {
        for (let j=0; j<NUM_COL; j++) {
            if (document.getElementById(`${i} ${j}`).style.backgroundColor == "black") {
                tableGridBinary[i][j] = 1;
            } else {
                tableGridBinary[i][j] = 0;
            }
        }
    }
}

function numberOfLiveNeighbours(row, col) {
    let count = 0;
    if (row>0 && col>0 && tableGridBinary[row-1][col-1]==1) {
        count++;
    }
    if (row>0 && tableGridBinary[row-1][col]==1) {
        count++;
    }
    if (row>0 && col<NUM_COL-1 && tableGridBinary[row-1][col+1]==1) {
        count++;
    }
    if (col>0 && tableGridBinary[row][col-1]==1) {
        count++;
    }
    if (col<NUM_COL-1 && tableGridBinary[row][col+1]==1) {
        count++;
    }
    if (row<NUM_ROW-1 && col>0 && tableGridBinary[row+1][col-1]==1) {
        count++;
    }
    if (row<NUM_ROW-1 && tableGridBinary[row+1][col]==1) {
        count++;
    }
    if (row<NUM_ROW-1 && col<NUM_COL-1 && tableGridBinary[row+1][col+1]==1) {
        count++;
    }
    return count;
}

function arrayToTableGrid() {
    for (let i=0; i<NUM_ROW; i++) {
        for (let j=0; j<NUM_COL; j++) {
            if (tableGridBinary[i][j] == 1 &&
                (numberOfLiveNeighbours(i, j)<2 || numberOfLiveNeighbours(i, j)>3)) {
                document.getElementById(`${i} ${j}`).style.backgroundColor = "white";
            } else if (tableGridBinary[i][j] == 0 &&
                numberOfLiveNeighbours(i, j)==3) {
                document.getElementById(`${i} ${j}`).style.backgroundColor = "black";
            }
        }
    }
}

function runGame() {
    tableGridToArray();
    arrayToTableGrid();
    gameStartTimer = setTimeout(runGame, timeBetweenSteps);
}

function stopGame() {
    clearTimeout(gameStartTimer);
    startPressed = false;
}

function resetGame() {
    stopGame();
    for (let i=0; i<NUM_ROW; i++) {
        for (let j=0; j<NUM_COL; j++) {
            document.getElementById(`${i} ${j}`).style.backgroundColor = "white";
        }
    }
}