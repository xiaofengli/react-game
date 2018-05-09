import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Snake from './greedysnake.jsx'
//import Tictactoe from './tictactoe.jsx'
//import ShoppingList from './shoppinglist.js'
//import MyTag from './MyTag.js'
//import Toggle from './Toggle.js'


class App extends React.Component {

  render() {
    return (
      <div>
       <Snake />
       {/*
       <Tictactoe />
       <ShoppingList name="xiaofeng li" />
       <MyTag category="30877"
         handleClick={this.handleClick.bind(this)}
       />
       <Toggle/>
       */}
       </div>
  );
  }
}


ReactDOM.render(
  <App />
 ,
  document.getElementById('root')
);
