import React from 'react';
import axios from 'axios';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import { About } from '../header/about';
import { Contact } from '../header/contact';
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { ProfileView } from '../profile-view/profile-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { UpdateView } from '../update-view/update-view';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import './main-view.scss';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
export class MainView extends React.Component {
  constructor() {
    // Call the superclass constructor
    // so React can initialize it
    super();

    // Initialize the state to an empty object so we can destructure it later
    this.state = {
      movies: [],
      user: null,
      profileInfo: null,
    };
  }

  getMovies(token) {
    axios
      .get('https://vfa.herokuapp.com/movies', {
        headers: { Authorization: 'Bearer ' + token },
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

  getAccount(accessToken) {
    const url =
      'https://vfa.herokuapp.com/users/' + localStorage.getItem('user');
    console.log(url);
    axios
      .get(url, {
        headers: { Authorization: 'Bearer ' + accessToken },
      })
      .then((response) => {
        // console.log(response.data);
        // Assign result to a state
        this.setState({
          profileInfo: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  addToFavourites(movie) {
    /* Send a request to the server for authentication */
    const url =
      'https://vfa.herokuapp.com/users/' +
      localStorage.getItem('id') +
      '/favourites/' +
      movie; // 'https://vfa.herokuapp.com/users/localStorage.getItem('user')}/favourites/${movie}';
    axios
      .post(
        url,
        {},
        {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }, //  `Bearer ${localStorage.getItem('token')}`
        }
      )
      .then((response) => {
        const data = response.data;
        console.log(data);
        // Send data to prop
        alert('Movie added to favourites');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    //  Get value of token from localStorage if present
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user'),
      });
      this.getMovies(accessToken);
      this.getAccount(accessToken);
    }
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('id');
    this.setState({
      user: null,
    });
  }

  onLoggedIn(authData) {
    this.setState({
      user: authData.user.Username,
    });
    // Add authData to browser's cache (that we got from props.logInFunc(data) in the profile.view)
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    localStorage.setItem('id', authData.user._id);
    // Calls endpoint once user is logged in
    this.getMovies(authData.token);
    this.getAccount(authData.token);
  }

  render() {
    // If the state isn't initialized, this will throw on runtime
    // before the data is initially loaded
    const { movies, user, profileInfo } = this.state;

    // Logging to check states
    // console.log('M = ' + movies);
    // console.log('U = ' + user);
    // console.log('pi =' + profileInfo);

    // Before the movies have been loaded
    if (!movies && !profileInfo) return <div className="main-view" />;

    return (
      <Router>
        <div className="main-view text-center container-fluid main-view-styles ">
          {/* Nav start */}
          <Navbar
            sticky="top"
            expand="lg"
            className="mb-2 navbar-styles text-warning"
          >
            <Navbar.Brand
              href="http://localhost:1234/"
              className="navbar-brand"
            >
              Victorville Film Archives
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse
              className="justify-content-end"
              id="basic-navbar-nav"
            >
              {!user ? (
                <ul>
                  <Link to={`/`}>
                    <Button variant="link">login</Button>
                  </Link>
                  <Link to={`/register`}>
                    <Button variant="link">Register</Button>
                  </Link>
                </ul>
              ) : (
                <ul>
                  <Link to={`/`}>
                    <Button variant="link" onClick={() => this.logOut()}>
                      Log out
                    </Button>
                  </Link>
                  <Link to={`/users/`}>
                    <Button variant="link">Account</Button>
                  </Link>
                  <Link to={`/`}>
                    <Button variant="link">Movies</Button>
                  </Link>
                  <Link to={`/about`}>
                    <Button variant="link">About</Button>
                  </Link>
                  <Link to={`/contact`}>
                    <Button variant="link">Contact</Button>
                  </Link>
                </ul>
              )}
            </Navbar.Collapse>
          </Navbar>
          {/* Nav end */}
          {/* If this.user === null don't show Link */}
          <Route
            exact
            path="/"
            render={() => {
              if (!user)
                return (
                  <LoginView logInFunc={(user) => this.onLoggedIn(user)} />
                );
              return (
                <div className="row d-flex mt-4 ml-1">
                  {movies.map((m) => (
                    <MovieCard
                      key={m._id}
                      movie={m}
                      addToFavourites={() => addToFavourites(movie)}
                    />
                  ))}
                </div>
              );
            }}
          />
          <Route
            path="/movies/:movieId"
            render={({ match }) => (
              <MovieView
                movie={movies.find((m) => m._id === match.params.movieId)}
                addToFavourites={() => addToFavourites(movie)}
              />
            )}
          />
          <Route
            path="/users/"
            render={() => (
              <ProfileView
                user={user}
                profileInfo={this.state.profileInfo}
                movies={movies}
                logOutFunc={() => this.logOut()}
              />
            )}
          />
          <Route
            path="/Update/:name"
            render={() => (
              <UpdateView user={user} profileInfo={this.state.profileInfo} />
            )}
          />
          <Route
            path="/directors/:name"
            render={({ match }) => (
              <DirectorView
                director={movies.find(
                  (m) => m.Director.Name === match.params.name
                )}
                movies={movies}
                addToFavourites={() => addToFavourites(movie)}
              />
            )}
          />
          <Route
            path="/genres/:name"
            render={({ match }) => (
              <GenreView
                genre={movies.find((m) => m.Genre.Name === match.params.name)}
                movies={movies}
                addToFavourites={() => addToFavourites(movie)}
              />
            )}
          />

          <Route path="/register" render={() => <RegistrationView />} />
        </div>
        <Route path="/contact" component={Contact} />
        <Route path="/about" component={About} />
      </Router>
    );
  }
}
