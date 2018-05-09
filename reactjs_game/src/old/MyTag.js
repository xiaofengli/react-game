import React from 'react';

import './index.css';

//second example
export default class MyTag extends React.Component {
  constructor() {
      super();
  }



  render() {
    return (
      <div>
       <button id='t'
       onClick={this.props.handleClick}>click here</button>
     </div>

    );
  }
}
