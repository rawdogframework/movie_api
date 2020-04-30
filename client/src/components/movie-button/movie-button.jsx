import React from 'react';

var buttonStyle = {
  margin: '10px 10px 10px 0',
  color: '#ffffff',
  backgroundColor: '#000000',
};

export class MovieButton extends React.Component {
  constructor() {
    super();
  }

  render() {
    const { passingOnToButtonComponent } = this.props;

    return (
      <div
        className="movie-button"
        style={buttonStyle}
        onClick={passingOnToButtonComponent}
      >
        Back
      </div>
    );
  }
}
