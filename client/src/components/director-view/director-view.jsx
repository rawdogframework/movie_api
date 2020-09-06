import React from 'react';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';

export class DirectorView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { movies, director } = this.props;

    if (!director) return null;

    return (
      <Container className="wrapper container-fluid">
        <Row>
          <Col className="col-3" />
          <Col className="director-view container-fluid align-items-center col-6">
            <img
              className="director-poster "
              src="https://via.placeholder.com/150"
            />
            <div className="director-title ">
              <span className="label">Name: </span>
              <span className="value">{director.Director.Name}</span>
            </div>
            <div className="director-description ">
              <span className="label">Bio: </span>
              <span className="value">{director.Director.Bio}</span>
            </div>
            <div className="director-birth ">
              <span className="label">Birth: </span>
              <span className="value">{director.Director.Birth}</span>
            </div>
            <div className="director-death ">
              <span className="label">Death: </span>
              <span className="value">{director.Director.Death}</span>
            </div>
          </Col>
          <Col className="col-3" />
        </Row>
        <Container>
          <h4 className="mt-4">Some {director.Director.Name} movies</h4>
          <div className="d-flex row mt-3 ml-1">
            {movies.map((movie) => {
              if (movie.Director.Name === director.Director.Name) {
                return (
                  <div key={movie._id}>
                    <Card
                      className="mb-3 mr-2 align-items-center"
                      style={{ width: '16rem' }}
                      bg="warning"
                      text="dark"
                    >
                      <Link to={`/movies/${movie._id}`}>
                        <Card.Img variant="top" src={movie.ImagePath} />
                      </Link>
                      <Card.Body variant="warning">
                        <Card.Title>{movie.Title}</Card.Title>
                        <Card.Text>
                          {movie.Description.substring(0, 70)}...
                          <div>
                            <Link
                              to={`/movies/${movie._id}`}
                              className="position-relative"
                            >
                              Read more
                            </Link>
                          </div>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </div>
                );
              }
            })}
          </div>
        </Container>
      </Container>
    );
  }
}

DirectorView.propTypes = {
  Movie: PropTypes.shape({
    Director: {
      Name: PropTypes.string.isRequired,
      Bio: PropTypes.string.isRequired,
      // ImagePath: PropTypes.string.isRequired,
      Birth: PropTypes.string.isRequired,
      Death: PropTypes.string.isRequired,
    },
  }).isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      Title: PropTypes.string.isRequired,
      ImagePath: PropTypes.string.isRequired,
      Description: PropTypes.string.isRequired,
    })
  ),
};
