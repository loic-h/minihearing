import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Loading from './loading';

export default class Player extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      stream: null,
      title: '',
      artist: '',
      playing: false,
      loading: false
    };
    this.handlerStreamReady = this.onStreamReady.bind(this);
    this.handlerStreamEnd = this.onStreamEnd.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.audio.addEventListener('canplaythrough', this.handlerStreamReady);
    this.audio.addEventListener('ended', this.handlerStreamEnd);
    if (nextProps.track) {
      this.setState({
        stream: nextProps.track.stream_url,
        title: nextProps.track.title,
        artist: nextProps.track.user.username,
        loading: true
      }, () => {
        this.audio.load();
      });
    }
  }

  componentWillUnmount() {
    this.audio.removeEventListener('canplaythrough', this.handlerStreamReady);
    this.audio.removeEventListener('ended', this.handlerStreamEnd);
  }

  onStreamReady() {
    this.audio.play();
    this.setState({
      playing: true,
      loading: false
    });
  }

  onStreamEnd() {
    this.setState({
      playing: false,
      stream: null,
      title: '',
      artist: ''
    })
  }

  onButtonClick() {
    if (this.state.playing) {
      this.setState({
        playing: false
      });
      this.audio.pause();
    } else {
      this.setState({
        playing: true
      });
      this.audio.play();
    }
  }

  renderButton() {
    if(this.state.loading) {
      return <Loading />;
    } else if (this.state.stream) {
      return <div className="player__button" onClick={e => this.onButtonClick()}></div>;
    }
  }

  render() {
    return (
      <div className={classnames({
        'player': true,
        'playing': this.state.playing
      })}>
        <audio ref={el => this.audio = el}>
          <source src={this.state.stream} />
        </audio>
        {this.renderButton()}
        {this.state.stream &&
          <div className="player__label">
            <span className="player__artist">{this.state.artist}</span>
            <span className="player__title">{this.state.title}</span>
          </div>
        }
      </div>
    )
  }
}

Player.propTypes = {
  track: PropTypes.object
};
