import React from 'react';
import PropTypes from 'prop-types';
import events from '../events';

export default class Artist extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      loading: false
    };
    this.page = 0;
    this.handlerScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    this.fetchTracks();
    window.scrollTo(document);
    window.addEventListener('scroll', this.handlerScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handlerScroll);
  }

  fetchTracks() {
    if (this.page === null) {
      return;
    }
    const page = this.page + 1;
    this.setState({
      loading: true
    }, () => {
      fetch(`https://api-v2.hearthis.at/${this.props.body.permalink}/?type=tracks&page=${page}&count=20`)
        .then(res => res.json())
        .then(json => {
          if (json.length > 0) {
            const tracks = this.state.tracks.concat(json);
            this.setState({
              tracks
            });
            this.page = page;
          } else {
            this.page = null;
          }
          this.setState({
            loading: false
          });
        });
    })
  }

  onTrackClick(track) {
    events.emit('PLAY_TRACK', track);
  }

  onScroll(e) {
    const element = document.documentElement;
    if (this.state.loading) {
      return;
    }
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      this.fetchTracks();
    }
  }

  render() {
    return (
      <div className="artist">
        <figure>
          <img src={this.props.body.avatar_url} alt={this.props.body.username} />
        </figure>
        <h3>{this.props.body.username}</h3>
        <ul className="artist-infos">
          <li className="artist-info artist-info--tracks">
            {this.props.body.track_count} tracks
          </li>
          <li className="artist-info artist-info--followers">
            {this.props.body.followers_count} followers
          </li>
        </ul>
        <div className="tracks">
          {this.state.tracks.map((track, index) => (
            <div className="track" key={index} onClick={e => this.onTrackClick(track)}>
              <h4>{track.title}</h4>
            </div>
          ))}
          {this.state.loading &&
            <div>Loading...</div>
          }
        </div>
      </div>
    );
  }
}

Artist.propTypes = {
  body: PropTypes.object.isRequired
}
