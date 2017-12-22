import React from 'react';
import PropTypes from 'prop-types';

export default class Top extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    console.log(this.props.artists);
    return (
      <div className="top">
        {this.props.artists.map((artist, index) => (
          <div key={index} className="artist">
            <figure>
              <img src={artist.avatar_url} alt={artist.username} />
            </figure>
            <h3>{artist.username}</h3>
          </div>
        ))}
      </div>
    )
  }
}

Top.propTypes = {
  artists: PropTypes.array
}
