import React from 'react';
import './movie-button.scss';

export function MovieButton({ label, passingOnToButtonComponent }) {
  return (
    <button className="button-styles" onClick={passingOnToButtonComponent}>
      {label}
    </button>
  );
}
