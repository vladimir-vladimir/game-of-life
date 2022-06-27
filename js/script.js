const OVERFLOW = 2;
let NUM_ROW;
let NUM_COL;
let timeBetweenSteps;

let tableGridBinary;
let startPressed = false;
let gameStartTimer;

let startGameButton = document.querySelector("#start-game-button");
startGameButton.addEventListener("click", () => {
    NUM_ROW = parseInt(document.querySelector("#num-row").value)+2*OVERFLOW;
    NUM_COL = parseInt(document.querySelector("#num-col").value)+2*OVERFLOW;
    timeBetweenSteps = parseInt(document.querySelector("#time-between-steps").value);
    drawTableGrid();
});

function drawTableGrid() {
    document.querySelector("#game").innerHTML = "";
    const gameTableGrid = document.createElement("div");
    gameTableGrid.setAttribute("id", "game-table-grid")
    document.querySelector("#game").appendChild(gameTableGrid);
    const gameButtons = document.createElement("div");
    gameButtons.setAttribute("id", "game-buttons");
    document.querySelector("#game").appendChild(gameButtons);

    // Buttons
    const startButton = document.createElement("button");
    startButton.innerText = "Start";
    startButton.addEventListener("click", () => {
        if (startPressed == true) {
            return;
        }
        startPressed = true;
        runGame();
    });
    document.querySelector("#game-buttons").append(startButton);

    const stopButton = document.createElement("button");
    stopButton.innerText = "Stop";
    stopButton.addEventListener("click", stopGame);
    document.querySelector("#game-buttons").append(stopButton);

    const resetButton = document.createElement("button");
    resetButton.innerText = "Reset";
    resetButton.addEventListener("click", resetGame);
    document.querySelector("#game-buttons").append(resetButton);

    const refreshButton = document.createElement("button");
    refreshButton.innerText = "Main Menu";
    refreshButton.addEventListener("click", () => {document.location.reload();});
    document.querySelector("#game-buttons").append(refreshButton);

    // Table Grid
    tableGridBinary = Array(NUM_ROW).fill().map(()=>Array(NUM_COL).fill());
    let height = width = Math.min((document.querySelector("#game").offsetHeight -
        document.querySelector("#game-buttons").offsetHeight)*1.0/(NUM_ROW-2*OVERFLOW),
        document.querySelector("#game").offsetWidth*1.0/(NUM_COL-2*OVERFLOW));
    const tableGrid = document.querySelector("#game-table-grid");
    tableGrid.style.height = height * (NUM_ROW-2*OVERFLOW) + "px";
    tableGrid.style.width = width * (NUM_COL-2*OVERFLOW) + "px";
    for (let i=0; i<NUM_ROW; i++) {
        const tableRow = document.createElement("div");
        tableRow.id = `${i}`;
        tableGrid.append(tableRow);
        for (let j=0; j<NUM_COL; j++) {
            const tableItem = document.createElement("div");
            tableItem.style.height = height + "px";
            tableItem.style.width = width + "px";
            tableItem.classList.add("cell");
            tableItem.id = `${i} ${j}`;
            tableItem.addEventListener("click", tableItemClick);
            if (i<OVERFLOW || j<OVERFLOW || i>=NUM_ROW-OVERFLOW || j>=NUM_COL-OVERFLOW) {
                tableItem.style.display = "none";
            }
            tableRow.append(tableItem);
        }
    }
}

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