import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './movie-card.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Link } from 'react-router-dom';

export class MovieCard extends React.Component {
  render() {
    const { movie } = this.props;
    return (
      <Col sm="2" md="4" lg="4" className="movie-card-styles">
        <Card text="dark" bg="warning">
          <Link to={`/movies/${movie._id}`}>
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
          </Link>
          <Card.Body>
            <Card.Title>{movie.Title}</Card.Title>
            <Card.Text>{movie.Description}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    );
  }
}

MovieCard.propTypes = {
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
