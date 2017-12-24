import React from 'react';
import PropTypes from 'prop-types';

export default class Player extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      stream: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.track) {
      this.setState({
        stream: nextProps.track.stream_url
      }, () => {
        this.audio.play();
      });
    }
  }

  render() {
    return (
      <div className="player">
        <audio ref={el => this.audio = el}>
          <source src={this.state.stream} />
        </audio>
      </div>
    )
  }
}

Player.propTypes = {
  track: PropTypes.object
};
