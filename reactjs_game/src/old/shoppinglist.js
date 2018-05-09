import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//second example
class ShoppingList extends React.Component {
  constructor() {
      super();
      console.log("in constructor");
  }

  componentWillMount() {
      console.log("in componentWillMount");
  }

  componentDidMount() {
      console.log("in componentDidMount");
  }

  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
          {console.log("in render()")}
      </div>
    );
  }
}

export default ShoppingList;
