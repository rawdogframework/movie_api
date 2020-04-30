import React from 'react';
import axios from 'axios';

import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

export class MainView extends React.Component {
  constructor() {
    // Call the superclass constructor
    // so React can initialize it
    super();

    // Initialize the state to an empty object so we can destructure it later
    this.state = {
      movies: null,
      selectedMovie: null,
    };
  }

  // One of the "hooks" available in a React Component
  componentDidMount() {
    axios
      .get('https://vfa.herokuapp.com/movies')
      .then((response) => {
        // Assign the result to the state
        this.setState({
          movies: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie,
    });
  }

  buttonFunc() {
    this.setState({
      selectedMovie: null,
    });
  }

  render() {
    // If the state isn't initialized, this will throw on runtime
    // before the data is initially loaded
    const { movies, selectedMovie } = this.state;

    // Logging to check states
    // console.log('SM = ' + selectedMovie);
    // console.log('M = ' + movies);

    // Before the movies have been loaded
    if (!movies) return <div className="main-view" />;

    return (
      <div className="main-view">
        {selectedMovie ? (
          <MovieView
            movie={selectedMovie}
            createdFuncAsPropFromMain={() => this.buttonFunc()}
          />
        ) : (
          movies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              createdFuncAsPropForMovieCard={(movie) =>
                this.onMovieClick(movie)
              }
            />
          ))
        )}
      </div>
    );
  }
}
