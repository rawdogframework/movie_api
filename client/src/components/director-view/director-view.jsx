import React from 'react';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export class DirectorView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { movie } = this.props;

    if (!movie) return null;

    return (
      <div className="wrapper container-fluid">
        <div className="col-3" />
        <div className="director-view container-fluid align-items-center col-6">
          <img
            className="director-poster "
            src="https://via.placeholder.com/150"
          />
          <div className="director-title ">
            <span className="label">Name: </span>
            <span className="value">{movie.Director.Name}</span>
          </div>
          <div className="director-description ">
            <span className="label">Bio: </span>
            <span className="value">{movie.Director.Bio}</span>
          </div>
          <div className="director-birth ">
            <span className="label">Birth: </span>
            <span className="value">{movie.Director.Birth}</span>
          </div>
          <div className="director-death ">
            <span className="label">Death: </span>
            <span className="value">{movie.Director.Death}</span>
          </div>
          <Link to={`/`}>
            <Button variant="link">Return</Button>
          </Link>
        </div>
        <div className="col-3" />
      </div>
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
    },
  }),
};
