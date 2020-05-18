import React from 'react';
import axios from 'axios';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { ProfileView } from '../profile-view/profile-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import './main-view.scss';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
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

    if (!user) {
      return (
        <Router>
          <div className="main-view">
            {/* Nav start */}
            <Navbar
              sticky="top"
              bg="light"
              expand="lg"
              className="mb-3 shadow-sm p-3 mb-5"
            >
              <Navbar.Brand
                href="http://localhost:1234/"
                className="navbar-brand"
              >
                VFA
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse
                className="justify-content-end"
                id="basic-navbar-nav"
              >
                <Link to={`/`}>
                  <Button variant="link">Login</Button>
                </Link>
                <Link to={`/register`}>
                  <Button variant="link">Register</Button>
                </Link>
              </Navbar.Collapse>
            </Navbar>
            {/* Nav end */}
            <Route
              exact
              path="/"
              render={() => (
                <LoginView logInFunc={(user) => this.onLoggedIn(user)} />
              )}
            />
            <Route path="/register" render={() => <RegistrationView />} />
          </div>
        </Router>
      );
    } else {
      return (
        <Router>
          <div className="main-view text-center container-fluid main-view-styles ">
            {/* Nav start */}
            <Navbar
              sticky="top"
              bg="light"
              expand="lg"
              className="mb-3 shadow-sm p-3 mb-5"
            >
              <Navbar.Brand
                href="http://localhost:1234/"
                className="navbar-brand"
              >
                VFA
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse
                className="justify-content-end"
                id="basic-navbar-nav"
              >
                <Link to={`/`}>
                  <Button variant="link" onClick={() => this.logOut()}>
                    Log out
                  </Button>
                </Link>
                <Link to={`/users/`}>
                  <Button variant="link">Account</Button>
                </Link>
              </Navbar.Collapse>
            </Navbar>
            {/* Nav end */}
            {/* If this.user === null don't show Link */}
            <Route
              exact
              path="/"
              render={() => {
                return (
                  <div className="row lg={4}">
                    {movies.map((m) => (
                      <MovieCard key={m._id} movie={m} />
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
                />
              )}
            />
            <Route
              path="/users/"
              render={() => (
                <ProfileView
                  user={user}
                  profileInfo={this.state.profileInfo}
                  logOutFunc={() => this.logOut()}
                />
              )}
            />
            <Route
              path="/directors/:name"
              render={({ match }) => (
                <DirectorView
                  movie={movies.find(
                    (m) => m.Director.Name === match.params.name
                  )}
                />
              )}
            />
            <Route
              path="/genres/:name"
              render={({ match }) => (
                <GenreView
                  movie={movies.find((m) => m.Genre.Name === match.params.name)}
                />
              )}
            />
          </div>
        </Router>
      );
    }
  }
}
