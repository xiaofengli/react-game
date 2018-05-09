import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
 state of a component is a json object {}.
 {} can have {value: 'xxx'} or {myArray}.

 props is the defined component's attributes object.
 You can think of it is an object as a whole.
 For example, the onclick ={} in the <Square> tag
 is passing the real handling action and define an event called
 onClick(), and inside of the Square class, the defined onClick()
 method earlier is accessed by this.props.onClick(), because
 it is in Square's props object.

 Also in the board, the <Square> tag has an attribute of 'value'.
 Please don't confuse yourself with the value attribute of standard html DOM.
 Think of this is just a symbol of a new attribute 'value' it is
 also part of the Square props object.
*/

var debugFlag = true;  //Global flag to control debugging print
var gameOver = false;

class Square extends React.Component {
  render() {
    return (
      /*
        The onclick event here is to tell that to
        register the event handling with its props, which is
        a layer passed down from the calling function/place
        which is the board.
      */
      <button className="square" onClick={() =>
          this.props.onClick()
      }>
        {this.props.value}
      </button>
    );
  }
  /*
   This will be called when you click the reset button.
   What happen is that the state of board will be reset and it will re-render.
   Then it will gives null value to the square 's props value.
  */
  componentWillReceiveProps(nextProps) {
      console.log(this.props.value);
  }
}





class Board extends React.Component {
  constructor(props) {
    super(props);
    /* Make an array of 9 to store the states of each square*/
    this.state = {
      squares: Array(9).fill(null),
       xIsNext: true, //init another var to control take turns
    };
  }


  /* Special method not builtin. Try to understand this.
  */
  handleClick(i) {
    const squares = this.state.squares.slice();
    /*
     If for the current cell it is 'X' then it is taken
     and it needs to be the other one.
     If it is not null, then do change its value and state
    */
    if (!squares[i]) {
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState(
          { squares: squares,
            // Flip the controll var
            xIsNext: !this.state.xIsNext,
          }
        );
    }
    this.forceUpdate(function() {
       if (this.checkGameOver()) {
         gameOver = true;
         //console.log(gameOver);
       }
       /* Use an asynchrous call to check if game is over, remember, if it
          is a blocking call, it will alert first and then render the X.
       */
       if (gameOver) {
         // This uses the bind() method, as setTimeout was a window object method.
         // Window object will not understand this, because this is a reactjs class.
         // So this way the global method of window object listen on the class event.
          setTimeout(function() { alert("Game Over, please click restart"); }.bind(this), 500);
       }
     });
  }


  // It will re-render whenever the state is change by default
  resetGameBoard() {
    this.setState(
    {
      squares: Array(9).fill(null),
      xIsNext: true,
    }
    );
	gameOver = false; //restart the game, to avoid the message.
  }

  checkGameOver() {
        //immutable copy of the state array
       const squares = this.state.squares.slice();
       let counter=0;
       for (let s of squares) {
         // ... do something with s ...
         if (!s) {
           continue;
         }
         counter++;
       }
       if (debugFlag) {
        // console.log(counter);
       }
       if (counter === squares.length) {
         return true;
       }
       return false;
  }

   /* presets the square value with nulls in the state arrays
    in the board's state
   */
  renderSquare(i) {
    return <Square value={this.state.squares[i]}
            onClick={() => this.handleClick(i)}
     />;
  }

  render() {
    const status = 'Next player:' + (this.state.xIsNext? 'X':'O');
    return (
      <div>
        <button onClick={()=>this.resetGameBoard()}>Restart Game</button>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

 class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

export default Game;
