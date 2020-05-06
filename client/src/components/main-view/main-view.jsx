import React from 'react';
import axios from 'axios';

import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import './main-view.scss';

export class MainView extends React.Component {
  constructor() {
    // Call the superclass constructor
    // so React can initialize it
    super();

    // Initialize the state to an empty object so we can destructure it later
    this.state = {
      movies: null,
      selectedMovie: null,
      user: null,
    };
  }

  getMovies(token) {
    axios
      .get('https://vfa.herokuapp.com/movies', {
        headers: { Authorization: 'Bearer' + token },
      })
      .then((response) => {
        // Assign result to a state
        this.setState({
          movies: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    //  Get value of token from localStorage if present
    let accessToken = localStorage.getItem('token');
    console.log('ac ===' + accessToken);
    let usernameeee = localStorage.getItem('user');
    console.log('uesr is====' + usernameeee);
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user'),
      });
      this.getMovies(accessToken);
    }
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

  onLoggedIn(authData) {
    this.setState({
      user: authData.user.Username,
    });
    console.log('username =====' + authData.user.Username);
    console.log('token =====' + authData.token);
    // Add authData to browser's
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    console.log('localtoken ===' + localStorage.token);
    console.log('localusername ===' + localStorage.user);
    // Calls endpoint once user is logged in
    this.getMovies(authData.token);
  }

  render() {
    // If the state isn't initialized, this will throw on runtime
    // before the data is initially loaded
    const { movies, selectedMovie, user } = this.state;

    // Logging to check states
    // console.log('SM = ' + selectedMovie);
    // console.log('M = ' + movies);
    // console.log('U = ' + user);

    // if there is no logged in user
    if (!user) return <LoginView logInFunc={(user) => this.onLoggedIn(user)} />;
    // Before the movies have been loaded
    if (!movies) return <div className="main-view" />;

    return (
      <div>
        <div className="text-center container-fluid main-view-styles">
          {selectedMovie ? (
            <MovieView
              movie={selectedMovie}
              buttonPropFromMain={() => this.buttonFunc()}
              label="Return"
            />
          ) : (
            movies.map((movie) => (
              <div className="container">
                <div className="row">
                  <MovieCard
                    key={movie._id}
                    movie={movie}
                    createdFuncAsPropForMovieCard={(movie) =>
                      this.onMovieClick(movie)
                    }
                    label="Open"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
}
