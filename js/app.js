var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var GLUE = 'GLUE';
var ballAudio = new Audio('audio/smb_coin.wav')

var gBallIntervalId
var gGlueIntervalId

var gGameStats = {
    isGlued: false,
    ballsCount: 2,
    ballCollected: 0,
    isOn: true
}
var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';
var GLUE_IMG = '<img src="img/glue.png" />'

var gBoard;
var gGamerPos;


function initGame() {
    gGamerPos = { i: 2, j: 9 };
    gBoard = buildBoard();
    renderBoard(gBoard);
    // createBallInterval()
    // createGlueInterval()
    // setInterval(() => {
    //     placeGameElememnt(ball, ballImg)
    // }, 1000);
    // setInterval(() => {
    //     placeGameElememnt(glue, glueImg)
    //     set
    // }, 1000);

    gBallIntervalId = setInterval(placeGameElement, 5000, BALL, BALL_IMG)
    gGlueIntervalId = setInterval(placeGameElement, 5000, GLUE, GLUE_IMG)
}

function buildBoard() {
    // Create the Matrix
    var board = createMat(10, 12)


    // Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            // Put FLOOR in a regular cell
            var cell = { type: FLOOR, gameElement: null };

            // Place Walls at edges
            if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
                cell.type = WALL;
            }

            // place floor passages
            if ((i === 0 && j === 5) || (i === 5 && j === 11) || (i === 9 && j === 5) || i === 5 && j === 0) {
                cell.type = FLOOR
            }

            // Add created cell to The game board
            board[i][j] = cell;
        }
    }

    // Place the gamer at selected position
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

    // Place the Balls (currently randomly chosen positions)
    board[3][8].gameElement = BALL;
    board[7][4].gameElement = BALL;

    console.log(board);
    return board;
}

// Render the board to an HTML table
function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];

            var cellClass = getClassName({ i: i, j: j })

            // TODO - change to short if statement
            if (currCell.type === FLOOR) cellClass += ' floor';
            else if (currCell.type === WALL) cellClass += ' wall';

            strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i}, ${j})" >\n`;

            // TODO - change to switch case statement
            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG;
            } else if (currCell.gameElement === BALL) {
                strHTML += BALL_IMG;
            }

            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }

    console.log('strHTML is:');
    console.log(strHTML);
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function placeGameElement(elm, elmImg) {
    if (elm === BALL) gGameStats.ballsCount++
    var cell = getRandomEmptyCell(gBoard)
    // renderCell(cell, elmImg)
    gBoard[cell.i][cell.j].gameElement = elm
    var elCell = document.querySelector(`.cell-${cell.i}-${cell.j}`)
    elCell.innerHTML = elmImg
    if (elm === GLUE) {
        setTimeout(() => {
            if (gGameStats.isGlued) return
            gBoard[cell.i][cell.j].gameElement = null
            elCell.innerHTML = ''
        }, 3000);
    }
}

// function createGlueInterval() {
//     gGlueIntervalId = setInterval(() => {
//         var cell = getRandomEmptyCell(gBoard)
//         gBoard[cell.i][cell.j].gameElement = GLUE
//         var elCell = document.querySelector(`.cell-${cell.i}-${cell.j}`)
//         elCell.innerHTML = GLUE_IMG
//         setInterval(() => {
//             gBoard[cell.i][cell.j].gameElement = null
//             elCell.innerHTML = ''
//         }, 10000);
//     }, 5000);
// }

// function createBallInterval() {
//     ballIntervalId = setInterval(() => {
//         var cell = getRandomEmptyCell(gBoard)
//         gBoard[cell.i][cell.j].gameElement = 'BALL'
//         var elCell = document.querySelector(`.cell-${cell.i}-${cell.j}`)
//         elCell.innerHTML = BALL_IMG
//         gGameStats.ballsCount++
//     }, 5000);
// }

// Move the player to a specific location
function moveTo(i, j) {

    if (!gGameStats.isOn) return
    if (gGameStats.isGlued) return

    var targetCell = gBoard[i][j];

    if (targetCell.type === WALL) return;

    // Calculate distance to make sure we are moving to a neighbor cell
    var iAbsDiff = Math.abs(i - gGamerPos.i);
    var jAbsDiff = Math.abs(j - gGamerPos.j);

    // If the clicked Cell is one of the four allowed
    if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0) ||
        (gGamerPos.i + i === 9) || (gGamerPos.j + j === 11)) {

        if (targetCell.gameElement === BALL) {
            ballAudio.play()
            gGameStats.ballCollected++
            gGameStats.ballsCount--

            if (gGameStats.ballsCount === 0) {
                endGame()
            }
            console.log('Collecting!');
        } else if (targetCell.gameElement === GLUE) {
            gGameStats.isGlued = true
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            elCell.style.backgroundColor = 'Yellow'
            console.log('You are Glued!!! hahah');
            setTimeout(() => {
                gGameStats.isGlued = false
                elCell.style.backgroundColor = ''

            }, 3000);

        }

        // MOVING from current position
        // Model:
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
        // Dom:
        renderCell(gGamerPos, '');

        // MOVING to selected position
        // Model:
        gGamerPos.i = i;
        gGamerPos.j = j;
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
        // DOM:
        renderCell(gGamerPos, GAMER_IMG);

    } // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

function restartGame(elBtn) {
    gGameStats.isGlued = false
    gGameStats.isOn = true
    gGameStats.ballsCount = 2
    gGameStats.ballCollected = 0
    elBtn.style.display = 'none'
    initGame()
}

function endGame() {
    clearInterval(gBallIntervalId)
    clearInterval(gGlueIntervalId)
    gGameStats.isOn = false
    var elBtn = document.querySelector('.restart')
    elBtn.style.display = 'block'
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

    var i = gGamerPos.i;
    var j = gGamerPos.j;


    switch (event.key) {
        case 'ArrowLeft':
            if (i === 5 && j === 0) {
                moveTo(5, 11)
                break;
            }
            moveTo(i, j - 1);
            break;
        case 'ArrowRight':
            if (i === 5 && j === 11) {
                moveTo(5, 0)
                break;
            }
            moveTo(i, j + 1);
            break;
        case 'ArrowUp':
            if (i === 0 && j === 5) {
                moveTo(9, 5)
                break;
            }
            moveTo(i - 1, j);
            break;
        case 'ArrowDown':
            if (i === 9 && j === 5) {
                moveTo(0, 5)
                break;
            }
            moveTo(i + 1, j);
            break;

    }

}

// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = `cell-${location.i}-${location.j}`;
    return cellClass;
}

function getRandomEmptyCell(board) {
    var cells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            if (cell.type === 'FLOOR' && cell.gameElement === null) {
                var coord = { i, j }
                cells.push(coord)
            }
        }
    }
    var randomCell = drawNum(cells)
    return randomCell
}