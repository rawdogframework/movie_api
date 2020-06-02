import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import './profile-view.scss';
import { connect } from 'react-redux';

export class ProfileView extends React.Component {
  constructor() {
    super();

    this.state = {
      username: null,
      password: null,
      email: null,
      birthday: null,
      favouriteMovies: [],
      movies: [],
    };
  }

  componentDidMount() {
    //authentication
    const accessToken = localStorage.getItem('token');
    this.getAccount(accessToken);
  }

  getAccount(token) {
    const username = localStorage.getItem('user');
    axios
      .get(`https://vfa.herokuapp.com/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        this.setState({
          Username: res.data.Username,
          Password: res.data.Password,
          Email: res.data.Email,
          Birthday: res.data.Birthday,
          favouriteMovies: res.data.FavouriteMovies,
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  removeFavourite(movie) {
    /* Send a request to the server for authentication */
    const url =
      'https://vfa.herokuapp.com/users/' +
      localStorage.getItem('id') +
      '/favourites/' +
      movie; // 'https://vfa.herokuapp.com/users/localStorage.getItem('user')}/favourites/${movie}';
    axios
      .delete(url, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }, //  `Bearer ${localStorage.getItem('token')}`
      })
      // reload page
      .then(() => {
        document.location.reload(true);
      })
      .then(() => {
        alert('Movie removed from favourites');
      })
      .catch((error) => {
        console.log('Issue deleting movie from favourites... >' + error);
      });
  }

  unregisterAccount() {
    if (!confirm('Are you sure?')) {
      return;
    }
    const url = 'https://vfa.herokuapp.com/users/' + localStorage.getItem('id');
    // console.log(url);
    axios
      .delete(url, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      })
      .then((response) => {
        console.log(response.data);
        // Set profile info to null
        this.props.logOutFunc();
        window.open('/', '_self');
        alert('Your account was successfully deleted');
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    const { movies } = this.props;
    // if (!user) return <div>Loading</div>;

    const favouritesList = movies.filter((movie) =>
      this.state.favouriteMovies.includes(movie._id)
    );

    return (
      <Container className="profile-view wrapper align-items-center container-fluid">
        <Row>
          <Col className="col-3" />
          <Col className="container-fluid align-items-left col-6">
            <img
              className="profile-avatar "
              src="https://via.placeholder.com/150"
            />
            <div className="account-username ">
              <span className="label">Username: </span>
              <span className="value">{this.state.Username}</span>
            </div>
            <div className="account-email ">
              <span className="label">Email: </span>
              <span className="value">{this.state.Email}</span>
            </div>
            <div className="account-birthday ">
              <span className="label">Birthday: </span>
              <span className="value">{this.state.Birthday}</span>
            </div>
            <div className="account-password ">
              <span className="label">Password: </span>
              <span className="value">***********</span>
            </div>
            <div>
              <Link to={`/update/${this.state.Username}`}>
                Update my profile
              </Link>
            </div>
          </Col>
          <Col className="col-3" />
        </Row>
        <Row className="spacer"></Row>
        <Container className="align-items-center justif-content-center">
          <h4>Favourites List</h4>
          <div className="d-flex row mt-5 ml-3 align-items-center">
            {favouritesList.map((movie) => {
              return (
                <div key={movie._id}>
                  <Card
                    bg="Dark"
                    className="mb-3 mr-2 align-items-center"
                    style={{ width: '16rem' }}
                  >
                    <Card.Img variant="top" src={movie.ImagePath} />
                    <Card.ImgOverlay className="">
                      <Card.Title>
                        <Button
                          variant="light"
                          onClick={() => this.removeFavourite(movie._id)}
                        >
                          Remove
                        </Button>
                      </Card.Title>
                    </Card.ImgOverlay>
                  </Card>
                </div>
              );
            })}
          </div>
        </Container>

        <Row>
          <Col>
            <div className="">
              <Button variant="danger" onClick={() => this.unregisterAccount()}>
                Delete Account
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

// let mapStateToProps = (state) => {
//   return { movies: state.movies };
// };

// #4
export default connect(({ movies, users }) => ({ movies, users }))(ProfileView);

ProfileView.PropTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      Title: PropTypes.string,
      _id: PropTypes.string,
      ImagePath: PropTypes.string,
    })
  ).isRequired,
  token: PropTypes.string.isRequired,
  logOutFunc: PropTypes.func.isRequired,
};
