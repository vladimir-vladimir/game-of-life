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
    const gameOfLife = document.querySelector("#game");
    gameOfLife.innerHTML = "";
    const gameTableGrid = document.createElement("div");
    gameTableGrid.setAttribute("id", "game-table-grid")
    gameOfLife.appendChild(gameTableGrid);
    const gameButtons = document.createElement("div");
    gameButtons.setAttribute("id", "game-buttons");
    gameOfLife.appendChild(gameButtons);

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

    tableGridBinary = Array(NUM_ROW).fill().map(()=>Array(NUM_COL).fill());

    let styleGameOfLife = getComputedStyle(gameOfLife);
    let paddingX = parseFloat(styleGameOfLife.paddingLeft) + parseFloat(styleGameOfLife.paddingRight);
    let paddingY = parseFloat(styleGameOfLife.paddingTop) + parseFloat(styleGameOfLife.paddingBottom);
    let marginX = parseFloat(styleGameOfLife.marginLeft) + parseFloat(styleGameOfLife.marginRight);
    let marginY = parseFloat(styleGameOfLife.marginTop) + parseFloat(styleGameOfLife.marginBottom);
    let height = width = Math.min((parseFloat(gameOfLife.offsetHeight) - paddingY - marginY -
        parseFloat(document.querySelector("#game-buttons").offsetHeight))/(NUM_ROW-2*OVERFLOW),
        (parseFloat(gameOfLife.offsetWidth) - paddingX - marginX)/(NUM_COL-2*OVERFLOW));
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
            tableItem.addEventListener("click", () => {tableItemClick(tableItem)});
            if (i<OVERFLOW || j<OVERFLOW || i>=NUM_ROW-OVERFLOW || j>=NUM_COL-OVERFLOW) {
                tableItem.style.display = "none";
            }
            tableRow.append(tableItem);
        }
    }
}

function tableItemClick(element) {
    if (startPressed == true) {
        return;
    }
    element.classList.toggle("alive");
}

function tableGridToArray() {
    for (let i=0; i<NUM_ROW; i++) {
        for (let j=0; j<NUM_COL; j++) {
            if (document.getElementById(`${i} ${j}`).classList.contains("alive")) {
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
                document.getElementById(`${i} ${j}`).classList.remove("alive");
            } else if (tableGridBinary[i][j] == 0 &&
                numberOfLiveNeighbours(i, j)==3) {
                document.getElementById(`${i} ${j}`).classList.add("alive");
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
            document.getElementById(`${i} ${j}`).classList.remove("alive");
        }
    }
}