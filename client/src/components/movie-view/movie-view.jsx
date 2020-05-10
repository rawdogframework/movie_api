import React from 'react';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export class MovieView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { movie } = this.props;

    if (!movie) return null;

    return (
      <div className="wrapper container-fluid">
        <div className="col-1" />
        <div className="movie-view container-fluid align-items-center col-10">
          <img className="movie-poster " src={movie.ImagePath} />
          <div className="movie-title ">
            <span className="label">Title: </span>
            <span className="value">{movie.Title}</span>
          </div>
          <div className="movie-description ">
            <span className="label">Description: </span>
            <span className="value">{movie.Description}</span>
          </div>
          <div className="movie-genre ">
            <span className="label">Genre: </span>
            <Link to={`/genres/${movie.Genre.Name}`}>
              <Button variant="link">{movie.Genre.Name}</Button>
            </Link>
          </div>
          <div className="movie-director ">
            <span className="label">Director: </span>
            <Link to={`/directors/${movie.Director.Name}`}>
              <Button variant="link">{movie.Director.Name}</Button>
            </Link>
          </div>
          <Link to={`/`}>
            <Button variant="link">Return</Button>
          </Link>
        </div>
        <div className="col-1" />
      </div>
    );
  }
}

MovieView.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired,
    Genre: PropTypes.shape({
      Name: PropTypes.string.isRequired,
    }),
    Director: PropTypes.shape({
      Name: PropTypes.string.isRequired,
    }),
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};
