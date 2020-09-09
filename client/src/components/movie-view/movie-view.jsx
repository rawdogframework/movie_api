import React from 'react';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';

export class MovieView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  /**
   * Function adds movie to database
   * @function addToFavourites
   * @param {object} movie
   * @returns {Promise<object>} response from Post request
   */

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

  render() {
    const { movie } = this.props;

    if (!movie) return null;

    return (
      <Container className="wrapper container-fluid align-items-center">
        <Row>
          <Col className="col-3" />
          <Col className="container-fluid col-6">
            <Card className="movie-view" bg="warning" text="dark">
              <Card.Img variant="top" src={movie.ImagePath} />
              <Card.ImgOverlay className="align-middle">
                <Card.Title>
                  <Button
                    variant="light"
                    onClick={() => this.addToFavourites(movie._id)}
                  >
                    Add to Favourites
                  </Button>
                </Card.Title>
              </Card.ImgOverlay>
              <Card.Body>
                <Card.Title>{movie.Title}</Card.Title>
                <Card.Text>
                  <div className="movie-description ">
                    <span className="label">Description: </span>
                    <span className="value">{movie.Description}</span>
                  </div>
                  <div className="movie-genre ">
                    <span className="label">Genre:</span>
                    <Link
                      className="position-relative"
                      to={`/genres/${movie.Genre.Name}`}
                    >
                      <Button variant="link">{movie.Genre.Name}</Button>
                    </Link>
                  </div>
                  <div className="movie-director ">
                    <span className="label">Director:</span>
                    <Link
                      className="position-relative"
                      to={`/directors/${movie.Director.Name}`}
                    >
                      <Button variant="link">{movie.Director.Name}</Button>
                    </Link>
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col className="col-3" />
        </Row>
      </Container>
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
};
