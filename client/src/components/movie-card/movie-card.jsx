import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import './movie-card.scss';

import { Link } from 'react-router-dom';

export class MovieCard extends React.Component {
  render() {
    const { movie } = this.props;
    return (
      <div>
        <Row>
          <Card className="movie-cards" text="dark" bg="warning">
            <Link to={`/movies/${movie._id}`}>
              <Card.Img variant="top" src={movie.ImagePath} />
            </Link>
            <Card.Body>
              <Card.Title key={movie._id}>{movie.Title}</Card.Title>
              <Card.Text>{movie.Description}</Card.Text>
            </Card.Body>
          </Card>
        </Row>
      </div>
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
};
