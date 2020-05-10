import React from 'react';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export class GenreView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { movie } = this.props;

    if (!movie) return null;

    return (
      <div className="wrapper container-fluid">
        <div className="col-3" />
        <div className="genre-view container-fluid align-items-center col-6">
          <img
            className="genre-poster "
            src="https://via.placeholder.com/150"
          />
          <div className="genre-title ">
            <span className="label">Name: </span>
            <span className="value">{movie.Genre.Name}</span>
          </div>
          <div className="genre-description ">
            <span className="label">Description: </span>
            <span className="value">{movie.Genre.Description}</span>
          </div>
          <Link to={`/`}>
            <Button variant="link">Return</Button>
          </Link>
        </div>
        <div className="col-3" />
      </div>
    );
  }
}

GenreView.propTypes = {
  Movie: PropTypes.shape({
    Genre: {
      Name: PropTypes.string.isRequired,
      Description: PropTypes.string.isRequired,
      // ImagePath: PropTypes.string.isRequired,
    },
  }),
};
