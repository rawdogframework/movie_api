import React from 'react';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';


export class MovieView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { movie, buttonPropFromMain, label } = this.props;

    if (!movie) return null;

    return (
      <div className="wrapper container-fluid">
      <div className="col-1"/>
      <div
        className="movie-view container-fluid align-items-center col-10"
      >
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
          <span className="value">{movie.Genre.Name}</span>
        </div>
        <div className="movie-director ">
          <span className="label">Director: </span>
          <span className="value">{movie.Director.Name}</span>
        </div>
        <Button variant="light" onClick={buttonPropFromMain}>{label}</Button>
      </div>
      <div className="col-1"/></div>
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
