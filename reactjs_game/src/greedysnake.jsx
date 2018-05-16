import React from 'react';
import './index.css';

/*
 state of a component is a json object {}.
 {} can have {value: 'xxx'} or {myArray}.

 props is the defined component's attributes object.
 Also in the board, the <Square> tag has an attribute of 'value'.
 Please don't confuse yourself with the value attribute of standard html DOM.
 Think of this is just a symbol of a new attribute 'value' it is
 also part of the Square props object.
*/

var debugFlag = true;  //Global flag to control debugging print
var gameOver = false;  // Control a new game
var intervalValue = 0; // Used by setInterval

class Square extends React.Component {
  render() {
    return (
      <button className="square" id={this.props.key}>
      {this.props.value}
      </button>
    );
  }
}



class Board extends React.Component {
  constructor(props) {
    super(props);
    /* Make an array of 9 to store the states of each square.
      TODO: this is a hardcode number, in order to make the game more portable, use a variable
    */
    this.state = {
      squares: Array(400).fill(null),
      foodPos: 0,
      currentHeadPos: 0,
      currentTailPos: 0,
      snakeLength: 3,
      keyboardDirection: 'RIGHT',
      tails: Array(0).fill(null),
      foodPositionbuffer:0,
    };

  }


  // It will re-render whenever the state is change by default
  initGameBoard() {
    const squares = [...this.state.squares];

    // Generate a position is where the snake head is
    const headPosition = this.generateRandomPosition();
    const tails=[...this.state.tails];
    let foodPosition = this.generateRandomPosition();
    while (foodPosition === headPosition) {
      foodPosition = this.generateRandomPosition();
    }
    // Draw the snake body with x, and record it with the state array
    if (!squares[headPosition]) {
      //TODO handle this error case
        squares[headPosition] = 'O';
        if (headPosition % 20 === 0) {
          console.error("this is the first element of a row");
        }
        // Make sure that the head is not the first element because
        // I need to draw a body that is consist by two nodes, so I
        // use headIndex-1 for the second node

        const curTailPos = headPosition-2;
        
        squares[foodPosition] = '*';
        tails.unshift(headPosition-1);
        tails.unshift(headPosition-2);

        //update tail to be shown on the grid
        var i;
        for (i = 0; i < tails.length; i++) { 
          squares[tails[i]]="X";  
        }
        this.setState(
          {
            squares: squares,
            currentHeadPos:headPosition,
            currentTailPos:curTailPos,
            foodPos: foodPosition,
            foodPositionbuffer:foodPosition,
            tails:tails,
          }
        );
    }

    // set up interval for repainting
    intervalValue = setInterval(
        () =>

          // Repaint the board
          this.forceUpdate(function() {
            /*
             if (this.checkGameOver()) {
               //gameOver = true;
             }
             this.drawSquare(headPosition);
             */
             this.moveSnake();
             
             console.log("repeating this");
           })

    , 1000);

	  gameOver = false; //restart the game, to avoid the message.
  }

  /* repaint the game Board
     make the dummmy snake head moving to the right
  */

  moveSnake() {
    // TODO there is a bug here, if the currentPosition is the end of the row
    // then make the head should appear in the front of offset length
    
    var newHeadPos=0;
    const newStateArr = Array(400).fill(null);
    const tails=[...this.state.tails];
    var tailpos=0;
    var oldfood=this.state.foodPositionbuffer;

    var curhead=this.state.currentHeadPos;

    var row=Math.floor(curhead/20);
    var column=curhead%20;
    //move snake depend on 
    switch (this.state.keyboardDirection) {
      case "RIGHT": {
        // code for "down arrow" key press.
        if(column==19){
          alert("loss");
        }

        
        newHeadPos = this.state.currentHeadPos+1;
        
        break;
      }
      case "UP": {
        // code for "up arrow" key press.
        if(row==0){
          alert("loss");
        }
        newHeadPos = this.state.currentHeadPos-20;
        break;
      }
      case "DOWN": {
        // code for "left arrow" key press.
        if(row==19){
          alert("loss");
        }
        newHeadPos = this.state.currentHeadPos+20;
        break;
      }
      case "LEFT":{
        // code for "right arrow" key press.
        if(column==0){
          alert("loss");
        }
        newHeadPos = this.state.currentHeadPos-1;
        break;
      }
      default:
      return; // Quit when this doesn't handle the key event.
    }
    

  
    var i;
    
    //move tail
    for (i = 0; i < tails.length; i++) { 




      if (i!=tails.length-1){
        if(i==0){
          tailpos=tails[0];
        }
        tails[i]=tails[i+1];
        if(tails[i]==newHeadPos){
          alert("loss")
        }
      }
      else{
        tails[i]=this.state.currentHeadPos;
        if(tails[i]==newHeadPos){
          alert("loss")
        }
      }
    }

    //check eat food 
    
    var newfoodpos=this.state.foodPos;
    if(tailpos==this.state.foodPositionbuffer){
      tails.unshift(tailpos);
      oldfood=this.state.foodPos;
    }
    if(newfoodpos==newHeadPos){
      oldfood=newfoodpos;
      newfoodpos=this.generateRandomPosition();
    }

    newStateArr[newfoodpos] = '*'
    
    newStateArr[newHeadPos] = 'O';
    
    

    //update tail to be shown on the grid
    for (i = 0; i < tails.length; i++) { 
      newStateArr[tails[i]]="X";  
    }
    while(newfoodpos!=this.state.foodPos && newStateArr[newfoodpos]!='*'){
      newfoodpos=this.generateRandomPosition();
    }
    this.setState(
      {
        squares : newStateArr,
        currentHeadPos: newHeadPos,
        tails:tails,
        foodPos:newfoodpos,
        foodPositionbuffer:oldfood,
        
      }
    );
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
    in the board's state; this method is to render each cell which is a button component.
    It uses the state array to keep track and intialize the board, in this initial state
    array I figured out and preset the array with head which is X and one body node
    which is a O.
   */
  renderSquare(i) {
    return <Square key={i} value={this.state.squares[i]}/>;
    // return <Square key={i} value={i}/>;
  }

  // Generate a random number used for the position for food or the head of the snake
  generateRandomPosition() {
      let position = 200;
      while ((position = this.getRandomInt(400)) < 100 || position>300) {
        position = this.getRandomInt(400);
      }
      return position;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  // After intial render, just do a painting of inital objects
  componentDidMount() {
    this.initGameBoard();
    this.registerKeyboard();
  }

  // To draw the board
  renderBoardRows() {
     var row = [];
     // Use j to control the row number
     for (var j=0;j<20;j++) {
       // Use i to control the index in each row
       for (var i=0;i<20;i++) {
             //console.log(j*10+i);
         row.push(this.renderSquare(j*20+i));
       }
       row.push(<br/>);
   }
     return row;
  }

  render() {
    return (
      <div>
        <button onClick={()=>this.resetGameBoard()}>Restart Game</button>
        <div className="status"></div>
        {this.renderBoardRows()}
      </div>
    );
  }

  resetGameBoard() {
    clearInterval(intervalValue);

    this.state = {
      squares: Array(400).fill(null),
      currentHeadPos: 0,
      tailPos: 0,
      snakeLength: 2,
    }
    alert('game restarted');
    window.location.reload();
  }

  // Controll keyboard for four direction key, don't do anything for other keys
  registerKeyboard() {
    var Direction=this.state.keyboardDirection;
    
    window.addEventListener("keydown", function (event) {
      if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
      }

      switch (event.key) {
        case "ArrowDown": {
          // code for "down arrow" key press.
          //alert('arrow down button is pressed');
          if(Direction=="UP"){
            break;
          }
          Direction='DOWN';
          this.setState(
            {
              keyboardDirection:Direction,
            }
          );
          
          break;
        }
        case "ArrowUp": {
          // code for "up arrow" key press.
          //alert('arrow up button is pressed');
          if(Direction=="DOWN"){
            break;
          }
          Direction='UP';
          this.setState(
            {
              keyboardDirection:Direction,
            }
          );
          
          break;
        }
        case "ArrowLeft": {
          // code for "left arrow" key press.
          //alert('arrow left button is pressed');
          if(Direction=="RIGHT"){
            break;
          }
          Direction='LEFT';
          this.setState(
            {
              keyboardDirection:Direction,
            }
          );
          
          break;
        }
        case "ArrowRight":{
          // code for "right arrow" key press.
          //alert('arrow right button is pressed');
          if(Direction=="LEFT"){
            break;
          }
          Direction='RIGHT'
          this.setState(
            {
              keyboardDirection:Direction,
            }
          );
          
          break;
        }
        default:

        return; // Quit when this doesn't handle the key event.
      }
      
      // Cancel the default action to avoid it being handled twice
      event.preventDefault();
    }.bind(this), true);

    
    
    
    // the last option dispatches the event to the listener first,
    // then dispatches event to window
  } // end of registerKeyboard
}  // end of class





export default class Game extends React.Component {
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
