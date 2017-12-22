import React from 'react';
import ReactDOM from 'react-dom';
import page from 'page';
import Top from './components/top'

const top_url = 'https://api-v2.hearthis.at/feed/?type=popular&page=1&count=5';

const routes = {
  '/': Top
}

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      component: <div>Loading</div>,
      artists: []
    }
  }

  componentDidMount() {
    this.initRouter();
    this.initArtists()
  }

  initRouter() {
    Object.keys(routes).forEach(path => {
      const Component = routes[path];

      page(path, ctx => {
        this.setState({component: <Component params={ctx.params} />});
      });
    });

    page();
  }

  initArtists() {
    this.fetchArtists()
      .then(artists  => {
        const promises = artists.map(artist => this.fetchArtist(artist.uri));
        Promise.all(promises).then(artists => {
          this.setState({
            artists: artists
          });
        });
      });
  }

  fetchArtists() {
    return new Promise((resolve, reject) => {
      fetch(top_url)
        .then(res => res.json())
        .then(tracks => {
          const users = {};
          for (let i in tracks) {
            const user = tracks[i].user;
            // be sure to have distinct artists
            if (!users[user.id]) {
              users[user.id] = user;
            }
          }
          resolve(Object.values(users));
        })
        .catch(reject);
    });
  }

  fetchArtist(uri) {
    return new Promise((resolve, reject) => {
      fetch(uri)
        .then(res => res.json())
        .then(json => {
          resolve(json);
        })
        .catch(reject);
    });
  }

  render() {

    return (
      <div id="app">
        <Top artists={this.state.artists} />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app-container'));
