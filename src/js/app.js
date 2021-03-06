import React from 'react';
import ReactDOM from 'react-dom';
import events from './events';
import Artists from './components/artists';
import Artist from './components/artist';
import Player from './components/player';

const top_url = 'https://api-v2.hearthis.at/feed/?type=popular&page=1&count=5';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      artist: null
    }
  }

  componentDidMount() {
    events.on('SELECT_ARTIST', (artist) => {
      this.setState({artist});
    });

    events.on('PLAY_TRACK', (track) => {
      this.setState({track}, () => {
        this.setState({track: null});
      });
    })
  }

  render() {
    return (
      <div id="app">
        <div className="content">
          {this.state.artist ? (
            <Artist body={this.state.artist} />
          ) : (
            <Artists url={top_url} />
          )}
          <Player track={this.state.track} />
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app-container'));
