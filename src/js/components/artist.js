import React from 'react';
import PropTypes from 'prop-types';
import events from '../events';
import Loading from './loading';

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

  onBackClick() {
    events.emit('SELECT_ARTIST', null);
  }

  render() {
    return (
      <div>
        <button className="back" onClick={e => this.onBackClick()}>
          <span>back</span>
        </button>
        <div className="artist">
          <figure className="artist__figure">
            <div>
              <img src={this.props.body.avatar_url} alt={this.props.body.username} />
            </div>
          </figure>
          <div className="artist__content">
            <h2 className="artist__title">{this.props.body.username}</h2>
            <ul className="artist__infos">
              <li className="artist__info artist__info--tracks">
                {this.props.body.track_count} tracks
              </li>
              <li className="artist__info artist__info--followers">
                {this.props.body.followers_count} followers
              </li>
            </ul>
          </div>
        </div>
        <div className="tracks">
          {this.state.tracks.map((track, index) => (
            <div className="track" key={index} onClick={e => this.onTrackClick(track)}>
              <button className="track__button"></button>
              <h4 className="track__title">{track.title}</h4>
            </div>
          ))}
          {this.state.loading &&
            <Loading />
          }
        </div>
      </div>
    );
  }
}

Artist.propTypes = {
  body: PropTypes.object.isRequired
}
