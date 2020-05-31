import React from 'react'
import './Results.css'

export default class Results extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div id="results" className="search-results">
          <p>{JSON.stringify(this.props.words,null,4)}</p>
          <p>{JSON.stringify(this.props.pos,null,4)}</p>
        </div>
    );
  }
}