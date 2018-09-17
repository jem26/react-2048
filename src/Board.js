import React from 'react';
import './Board.css';
import Swipeable from 'react-swipeable';
import cookie from 'react-cookies';

const BOARD_SIZE = 4;

class Board extends React.Component {
    constructor() {
        super();
        this.state = {
            board: [[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0]],
            gameOver: false,
            score: 0,
            lastDirection: ' ',
            highScore: cookie.load('highScore'),
        }
        if (typeof(this.state.highScore) === 'undefined') {
            cookie.save('highScore', 0, { path: '/' });
            this.setState({highScore: cookie.load('highScore')});
        }
        this.placeNewRandom();
        this.placeNewRandom();
    }

    componentDidMount() {
        document.addEventListener("keyup", this.checkKeyPress, false);
    }

    componentWillUnmount(){
        document.removeEventListener("keyup", this.checkKeyPress, false);
    }

    checkKeyPress = (e) => {
        if (e.keyCode === 37) {
            this.moveLeft();
        }
        else if (e.keyCode === 38) {
            this.moveUp();
        }
        else if (e.keyCode === 39) {
            this.moveRight();
        }
        else if (e.keyCode === 40) {
            this.moveDown();
        }
    }

    moveLeft = () => {
        let hasAnyChange = false;
        for (let i = 0; i < BOARD_SIZE; i++) {
            let arr = this.state.board[i];
            let orig = arr;
            arr = this.reducedArray(arr);
            this.state.board[i][0] = arr[0];
            this.state.board[i][1] = arr[1];
            this.state.board[i][2] = arr[2];
            this.state.board[i][3] = arr[3];
            if (orig.toString !== arr.toString) { hasAnyChange = true; }
        }
        if (hasAnyChange || (this.state.lastDirection !== 'left')) { this.checkWin(); }
        this.setState({board: this.state.board});
        this.setState({lastDirection: 'left'})
    }

    moveUp = () => {
        let hasAnyChange = false;
        for (let i = 0; i < BOARD_SIZE; i++) {
            let arr = [this.state.board[0][i],this.state.board[1][i], this.state.board[2][i], this.state.board[3][i]];
            let orig = arr;
            arr = this.reducedArray(arr);
            this.state.board[0][i] = arr[0];
            this.state.board[1][i] = arr[1];
            this.state.board[2][i] = arr[2];
            this.state.board[3][i] = arr[3];
            if (orig.toString !== arr.toString) { hasAnyChange = true; }
        }
        if (hasAnyChange || (this.state.lastDirection !== 'up')) { this.checkWin(); }
        this.setState({board: this.state.board});
        this.setState({lastDirection: 'up'})
    }

    moveRight = () => {
        let hasAnyChange = false;
        for (let i = 0; i < BOARD_SIZE; i++) {
            let arr = [this.state.board[i][3],this.state.board[i][2],this.state.board[i][1],this.state.board[i][0]];
            let orig = arr;
            arr = this.reducedArray(arr);
            this.state.board[i][0] = arr[3];
            this.state.board[i][1] = arr[2];
            this.state.board[i][2] = arr[1];
            this.state.board[i][3] = arr[0];
            if (orig.toString !== arr.toString) { hasAnyChange = true; }
        }
        if (hasAnyChange || (this.state.lastDirection !== 'right')) { this.checkWin(); }
        this.setState({board: this.state.board});
        this.setState({lastDirection: 'right'})
    }

    moveDown = () => {
        let hasAnyChange = false;
        for (let i = 0; i < BOARD_SIZE; i++) {
            let arr = [this.state.board[0][i],this.state.board[1][i], this.state.board[2][i], this.state.board[3][i]];
            let orig = arr;
            arr = this.reducedArray(arr); 
            this.state.board[3][i] = arr[0];
            this.state.board[2][i] = arr[1];
            this.state.board[1][i] = arr[2];
            this.state.board[0][i] = arr[3];
            if (orig.toString !== arr.toString) { hasAnyChange = true; }
        }
        if (hasAnyChange || (this.state.lastDirection !== 'down')) { this.checkWin(); }
        this.setState({board: this.state.board});
        this.setState({lastDirection: 'down'})
    }

    reducedArray = (arr) => {
        arr = arr.filter(function(number) {return number > 0;} );
        let zerosToPush = (BOARD_SIZE - arr.length);
        for (let z = 0; z < zerosToPush; z++) {
            arr.push(0);
        }
        for (let j = 0; j < BOARD_SIZE; j++) {
            if ((arr[j] === arr[j+1]) && arr[j]!==0) {
                arr[j] = arr[j]*2;
                this.setState({score: this.state.score + arr[j]*2});
                arr.splice(j+1, 1);
                arr.push(0); 
            }
        }
        return arr;
    }

    checkWin = () => {
        var foundZero = false;
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++){
                if (this.state.board[i][j] === 0) {foundZero = true;}
            }
        }
        if (foundZero) {
            this.placeNewRandom();
        } else {
            this.setState({gameOver: true})
        }
    }

    placeNewRandom = () => {
        let foundPlace = false;
        let row = 0;
        let col = 0;
        while (!foundPlace) {
            row = Math.floor(Math.random() * 4);
            col = Math.floor(Math.random() * 4);
            if (this.state.board[row][col] === 0) {
                foundPlace = true;
            }
        }
        let num = Math.floor(Math.random() * 3);
        if (num === 0) {
            this.state.board[row][col] = 4;
        } else {
            this.state.board[row][col] = 2;
        }
    }

    checkPrintBoard = () => {
        console.log("0. ", this.state.board[0][0], this.state.board[0][1], this.state.board[0][2], this.state.board[0][3]);
        console.log("1. ", this.state.board[1][0], this.state.board[1][1], this.state.board[1][2], this.state.board[1][3]);
        console.log("2. ", this.state.board[2][0], this.state.board[2][1], this.state.board[2][2], this.state.board[2][3]);
        console.log("3. ", this.state.board[3][0], this.state.board[3][1], this.state.board[3][2], this.state.board[3][3]);
    }

    handleNew = () => {
        this.state.board = [[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0]];
        this.setState({gameOver: false});
        this.setState({score: 0});
        this.setState({lastDirection: ' '});
        this.setState({highScore: cookie.load('highScore')});
        this.placeNewRandom();
        this.placeNewRandom();
        this.setState({board: this.state.board})
    }

    renderTiles = () => {
        return this.state.board.map((datarow) => {
            return datarow.map((dataitem) => {
                return (
                    <div className={"col-3 tile"+dataitem}><p key={dataitem} className={"w3-animate-zoom"}>{dataitem===0? '':dataitem}</p></div>
                );
            });
        });
    }

    render() {
        if (this.state.score > this.state.highScore) {
            cookie.save('highScore', this.state.score, { path: '/' });
            this.setState({highScore: cookie.load('highScore')});
        }
        return (
            <Swipeable
            onSwipedUp={this.moveUp}
            onSwipedDown={this.moveDown}
            onSwipedLeft={this.moveLeft}
            onSwipedRight={this.moveRight}
            preventDefaultTouchmoveEvent="true" >
            <div className="boardContainer">
                <div className="scoreText">Score: {this.state.score}</div>
                <div className="highScoreText">High Score: {this.state.highScore}</div>
                <div className="row">
                    {this.renderTiles()}
                </div>
                <div className="buttonContainer">
                    <button type="button" className="btn btn-outline-secondary" onClick={this.handleNew}>New Game</button>
                </div>
            </div>
            </Swipeable>
        );
    }
}

export default Board;