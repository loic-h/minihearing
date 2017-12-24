import React from 'react';
import PropTypes from 'prop-types';
import events from '../events';

export default class Artists extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      artists: null
    };
  }

  componentDidMount() {
     this.initArtists()
   }

   initArtists() {
     this.fetchArtists()
       .then(artists  => {
         const promises = artists.map(artist => this.fetchArtist(artist.uri));
         Promise.all(promises).then(artists => {
           this.setState({artists});
         });
       });
   }

   fetchArtists() {
     return new Promise((resolve, reject) => {
       fetch(this.props.url)
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
      <div className="artists">
        {!this.state.artists ? (
          <div>Loading...</div>
        ) : (
          this.state.artists.map((artist, index) => (
            <div key={index} className="artists-item" onClick={e => events.emit('SELECT_ARTIST', artist)}>
              <figure className="artists-item-figure">
                <div className="artists-item-figure__container">
                  <img src={artist.avatar_url} alt={artist.username} />
                </div>
              </figure>
              <div className="artists-item__content">
                <h3 className="artists-item__title">{artist.username}</h3>
                <ul className="artists-item__infos">
                  <li className="artists-item__info artists-item__info--tracks">
                    {artist.track_count} tracks
                  </li>
                  <li className="artists-item__info artists-item__info--followers">
                    {artist.followers_count} followers
                  </li>
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    )
  }
}

Artists.propTypes = {
  url: PropTypes.string,
  onClick: PropTypes.func
}
