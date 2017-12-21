import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {

  render() {
    return (
      <div id="app">
        App
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app-container'));
