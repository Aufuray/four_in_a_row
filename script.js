"use strict";

//Initial matrix
 // 0 0 0 0 0 0 0
 // 0 0 0 0 0 0 0
 // 0 0 0 0 0 0 0
 // 0 0 0 0 0 0 0
 // 0 0 0 0 0 0 0
 // 0 0 0 0 0 0 0
 //Plater 1: 1
// Player 2: computer

function FourInARow() {
    this.matrixArr = [];
    this.move = 0;
    this.gamePaused = false;
    this.roundEnded = false;
    this.invalidMove = false;
    this.initialize = false;
    var thisObject = this;
    var humanPieceCol = '#ff4136';
    var computerPieceCol = '#e8c32f'
    var defaultPieceCol = 'transparent'
    var shapeOutlineCol = '#000'
    var boardColor  = '#353435';
    var minDist = -100000000007;
    var maxDist = 100000000007;

    this.startgame = function () {
        this.matrixArr = [];
        this.gamePaused = false;
        this.roundEnded = false;
        this.invalidMove = false;
        this.move = 0;
        this.initializeGame();
        var x, y;
        for (x = 0; x <= 6; x++) {
        this.matrixArr[x] = [];
        for (y = 0; y <= 7; y++) {
            this.matrixArr[x][y] = 0;
        }
        }
        this.clearBoard();
        this.colorBoard();
    };

    this.initializeGame = function () {
        this.canvas = document.getElementsByTagName("canvas")[0];
        if (this.initialize) {
            return false;
        }
        this.canvas.addEventListener('click', function (e) {
            thisObject.onclick(thisObject.canvas, e);
        });
        this.context = this.canvas.getContext('2d');
        this.initialize = true;
    };

    this.playerTurn = function () {
        if (this.move % 2 === 0) {
            return 1;
        }
        return -1;
    };

    this.updateMatrix = function (gameState, matrixCol, value) {
        var tempMap = gameState.clone();
        if (tempMap[0][matrixCol] !== 0 || matrixCol < 0 || matrixCol > 6)
            return -1;

        var complete = false;
        var matrixRow = 0;
        var i;
        for (i = 0; i < 5; i++) {
            if (tempMap[i + 1][matrixCol] !== 0) {
                complete = true;
                matrixRow = i;
                break;
            }
        }
        if (!complete) {
            matrixRow = 5;
        }
        tempMap[matrixRow][matrixCol] = value;
        return tempMap;

    };
    this.gameWon = function (player) {
        this.gamePaused = true;
        this.roundEnded = true;
        this.invalidMove = false;
        var verdict = null;
        if (player < 0) {
            verdict = "Computer wins!";
        } else if (player > 0) {
            verdict = "You win!";
        } else {
            verdict = "It's a draw";
        }
        alert(verdict);
        this.context.save();
        this.context.restore();
    };

    this.action = function (matrixCol, callbackFunction) {
        if (this.gamePaused || this.roundEnded) 
            return 0;
        if (this.matrixArr[0][matrixCol] !== 0 || matrixCol < 0 || matrixCol > 6)
            return -1;

        var complete = false;
        var row = 0;
        var i;
        for (i = 0; i < 5; i++) {
            if (this.matrixArr[i+1][matrixCol] !== 0) {
                complete = true;
                row = i;
                break;
            }
        }
        if (!complete) {
            row = 5;
        }
        this.gameEffect(matrixCol, this.playerTurn(this.move), row, 0, 
            function () {
            thisObject.matrixArr[row][matrixCol] = thisObject.playerTurn(thisObject.move);
            thisObject.move = thisObject.move+1;
            thisObject.displayShape();
            thisObject.gameStatus();
            callbackFunction();
        });
        this.gamePaused = true;
        return 1;
    };

    this.gameStatus = function () {
        var rightAxis = 0; var bottomAxis = 0;
        var bottomRightAxis = 0; var topRightAxis = 0;
        var x;
        var y;
        var z;

        for (x = 0; x < 6; x++) {
            for (y = 0; y < 7; y++) {
                rightAxis = 0;
                bottomAxis = 0;
                bottomRightAxis = 0;
                topRightAxis = 0;
                for (z = 0; z <= 3; z++) {
                    if (x - z >= 0 && y + z < 7) {
                        topRightAxis += this.matrixArr[x - z][y + z];
                    }
                    if (y + z < 7) {
                        rightAxis += this.matrixArr[x][y + z];
                    }
                    if (x + z < 6) {
                        bottomAxis += this.matrixArr[x + z][y];
                    }
                    if (x + z < 6 && y + z < 7) {
                        bottomRightAxis += this.matrixArr[x + z][y + z];
                    }   
                }
                if (Math.abs(rightAxis) === 4) 
                    this.gameWon(rightAxis);
                else if (Math.abs(bottomAxis) === 4) 
                    this.gameWon(bottomAxis);
                else if (Math.abs(bottomRightAxis) === 4) 
                    this.gameWon(bottomRightAxis);
                else if (Math.abs(topRightAxis) === 4) 
                    this.gameWon(topRightAxis);
            }
        }
        if ((!this.roundEnded) && (this.move === 42))
            this.gameWon(0);
    };
    this.colorBoard = function () {
        this.context.save();
        this.context.fillStyle = boardColor;
        this.context.beginPath();
        var x, y;
        for (y = 0; y < 6; y++) {
            for (x = 0; x < 7; x++) {
                this.context.arc(75 * x + 100, 75 * y + 50, 25, 0, 2 * Math.PI);
                this.context.rect(75 * x + 150, 75 * y, -100, 100);
            }
        }
        this.context.fill();
        this.context.restore();
    };

    this.displayShape = function () {
        var x, y;
        var pieceColor;
        for (y = 0; y < 6; y++) {
            for (x = 0; x < 7; x++) {
                pieceColor = defaultPieceCol;
                if (this.matrixArr[y][x] >= 1) {
                    pieceColor = humanPieceCol;
                } else if (this.matrixArr[y][x] <= -1) {
                    pieceColor = computerPieceCol;
                }
                this.drawCanvasShape(75 * x + 100, 75 * y + 50, 25, pieceColor, shapeOutlineCol);
            }
        }
    };
    this.drawCanvasShape = function (x, y, z, colorFill, colorStroke) {
        this.context.save();
        this.context.strokeStyle = colorStroke;
        this.context.fillStyle = colorFill;
        this.context.beginPath();
        this.context.arc(x, y, z, 0, 2 * Math.PI, false);
        this.context.fill();
        this.context.restore();
    };
    this.clearBoard = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    this.gameEffect = function (matrixCol, move, matrixRow, matrixPosition, callbackFunction) {
        var pieceColor = defaultPieceCol;
        if (move >= 1) 
            pieceColor = humanPieceCol;
        else if (move <= -1) 
            pieceColor = computerPieceCol;
        
        if (matrixRow * 75 >= matrixPosition) {
            this.clearBoard();
            this.displayShape();
            this.drawCanvasShape(75 * matrixCol + 100, matrixPosition + 50, 25, pieceColor, shapeOutlineCol);
            this.colorBoard();
            window.requestAnimationFrame(function () {
                thisObject.gameEffect(matrixCol, move, matrixRow, matrixPosition + 25, callbackFunction);
            });
        } else 
            callbackFunction();
    };

    this.shapeInPos = function (index, offset, radius) {
        if ((index[0] - offset)*(index[0] - offset) <=  radius * radius) 
            return true;
        else
            return false;
    };

    this.onclick = function (canvas, elem) {
        if (this.invalidMove) {
            return false;
        }
        if (this.roundEnded) {
            this.startgame();
            return false;
        }
        var x; var y; var z; var validMove;

        var boundingBox = canvas.getBoundingClientRect(),
            x = elem.clientX - boundingBox.left,
            y = elem.clientY - boundingBox.top;

        for (z = 0; z < 7; z++) {
            if (this.shapeInPos([x, y], 75 * z + 100, 25)) {
                this.gamePaused = false;
                validMove = this.action(z, function () {
                    thisObject.alphaPruning(-1);
                });
                if (validMove === 1) { 
                    this.invalidMove = true;
                }
                break; 
            }
        }
    };

    this.alphaPruning = function (heuristicValue) {
        var gameState = this.matrixArr.clone();

        var computerNextMove = null;
        function checkState(gameState) {
            var goal = 0;
            var estimateToGoal = 0;
            var rightAxis = 0; var bottomAxis = 0;
            var bottomRightAxis = 0; var topRightAxis = 0;
            var x; var y; var z;
            var goalAndEstimate = [goal, estimateToGoal];

            for (x = 0; x < 6; x++) {
                for (y = 0; y < 7; y++) {
                    rightAxis = 0;
                    bottomAxis = 0;
                    bottomRightAxis = 0;
                    topRightAxis = 0;
                    for (z = 0; z <= 3; z++) {
                        if (y + z < 7) 
                            rightAxis = rightAxis + gameState[x][y+z];
                        if (x + z < 6 && y + z < 7) 
                            bottomRightAxis = bottomRightAxis + gameState[x+z][y+z];
                        if (x + z < 6) 
                            bottomAxis = bottomAxis + gameState[x+z][y];
                        if (x - z >= 0 && y + z < 7) 
                            topRightAxis = topRightAxis + gameState[x-z][y+z];
                    }
                    estimateToGoal = estimateToGoal + rightAxis * rightAxis * rightAxis;
                    estimateToGoal = estimateToGoal + bottomAxis * bottomAxis * bottomAxis;
                    estimateToGoal = estimateToGoal + bottomRightAxis * bottomRightAxis * bottomRightAxis;
                    estimateToGoal = estimateToGoal + topRightAxis * topRightAxis * topRightAxis;

                    if (Math.abs(rightAxis) === 4) 
                        goal = rightAxis;
                    else if (Math.abs(bottomAxis) === 4) 
                        goal = bottomAxis;
                    else if (Math.abs(bottomRightAxis) === 4) 
                        goal = bottomRightAxis;
                    else if (Math.abs(topRightAxis) === 4) 
                        goal = topRightAxis;
                }
            }
            goalAndEstimate[0] = goal;
            goalAndEstimate[1] = estimateToGoal

            return goalAndEstimate;
        }
        function checkDistanceFromGoal(gameState, treeDepth, alphaPrune, betaPrune) {
            var estimateVal; var goal; var estimateToGoal; var goalState;
            var valueAtCurrState = checkState(gameState);
            if (treeDepth >= 4) { 
                estimateVal = 0;
                goal = valueAtCurrState[0];
                estimateToGoal = valueAtCurrState[1] * heuristicValue;
                estimateVal = estimateToGoal;

                if (goal === 4 * heuristicValue)
                    estimateVal = 999999;
                else if (goal === 4 * heuristicValue * -1)
                    estimateVal = 999999 * -1;
                estimateVal -= treeDepth * treeDepth;
                return [estimateVal, -1];
            }

            goalState = valueAtCurrState[0];
            if (goalState === 4 * heuristicValue) 
                return [999999 - treeDepth * treeDepth, -1];
            if (goalState === 4 * heuristicValue * -1)  
                return [999999 * -1 - treeDepth * treeDepth, -1];

            if (treeDepth % 2 === 0) 
                return minState(gameState, treeDepth+1, alphaPrune, betaPrune);
            
            return maxState(gameState, treeDepth + 1, alphaPrune, betaPrune);

        }
        function computerMove(move) {
            var randomMove = move[Math.floor(Math.random() * move.length)];
            return randomMove;
        }
        function maxState(gameState, treeDepth, alphaPrune, betaPrune) {
            var maxStateArr = [0,0]; var alphaQueue = [];
            var move = -1;
            var distance = null; var currState = null;
            var x;  var y = minDist;

            for (x = 0; x < 7; x++) {
                currState = thisObject.updateMatrix(gameState, x, heuristicValue);
                if (currState !== -1) {
                    distance = checkDistanceFromGoal(currState, treeDepth, alphaPrune, betaPrune);
                    if (distance[0] > y) {
                        y = distance[0];
                        move = x;
                        alphaQueue = [];                                                                         
                        alphaQueue.push(x);
                    } else if (distance[0] === y) {
                        alphaQueue.push(x);
                    }

                    if (y > betaPrune) {
                        move = computerMove(alphaQueue);
                        return [y, move];
                    }
                    alphaPrune = Math.max(alphaPrune, y);
                }
            }
            move = computerMove(alphaQueue);
            maxStateArr[0] = y;
            maxStateArr[1] = move;
            return maxStateArr;
        }
        function minState(gameState, treeDepth, alphaPrune, betaPrune) {
            var minStateArr = [0,0]; var betaQueue = [];
            var move = -1;
            var distance = null; var currState = null;
            var x;  var y = minDist;

            for (x = 0; x < 7; x++) {
                currState = thisObject.updateMatrix(gameState, x, heuristicValue * -1);
                if (currState !== -1) {

                    distance = checkDistanceFromGoal(currState, treeDepth, alphaPrune, betaPrune);
                    if (distance[0] < y) {
                        y = distance[0];
                        move = x;
                        betaQueue = [];
                        betaQueue.push(x);
                    } else if (distance[0] === y) {
                        betaQueue.push(x);
                    }
                    if (y < alphaPrune) {
                        move = computerMove(betaQueue);
                        minStateArr[0] = y;
                        minStateArr[1] = move;
                        return minStateArr;
                    }
                    betaPrune = Math.min(betaPrune, y);
                }
            }
            move = computerMove(betaQueue);
            minStateArr[0] = y;
            minStateArr[1] = move;
            return minStateArr;
        }
        var moveValue = maxState(gameState, 0, minDist, maxDist);
        computerNextMove = moveValue[1];

        this.gamePaused = false;
        var complete = this.action(computerNextMove, function () {
            thisObject.invalidMove = false;
        });

        while (complete < 0) {
            computerNextMove = Math.floor(Math.random() * 7);
            complete = this.action(computerNextMove, function () {
                thisObject.invalidMove = false;
            });
        }

    };
    this.startgame();
}

Array.prototype.clone = function () {
    var tempArray = [], i;
    for (i = 0; i < this.length; i++) {
        tempArray[i] = this[i].slice();
    }
    return tempArray;
};

document.addEventListener('DOMContentLoaded', function () {
    new FourInARow();
});