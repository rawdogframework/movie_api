import React from 'react';
import PropTypes from 'prop-types';

export class MovieCard extends React.Component {
  render() {
    // This is given to the <MovieCard/> component by the outer world
    // which, in this case, is `MainView`, as `MainView` is what’s
    // connected to your database via the movies endpoint of your API
    const { movie, createdFuncAsPropForMovieCard } = this.props;

    return (
      <div
        onClick={() => createdFuncAsPropForMovieCard(movie)}
        className="movie-card"
      >
        {movie.Title}
      </div>
    );
  }
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired,
    // ADD IN ONCE SKELETON WORKS
    // Genre: PropTypes.shape({
    //   Name: PropTypes.string.isRequired,
    //   Description: PropTypes.string.isRequired,
    // }),
    // Director: PropTypes.shape({
    //   Name: PropTypes.string.isRequired,
    //   Description: PropTypes.string.isRequired,
    //   Birth: PropTypes.string.isRequired,
    //   Death: PropTypes.string,
    // }),
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};
