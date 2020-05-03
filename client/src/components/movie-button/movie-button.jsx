import React from 'react';
import './movie-button.scss';

export function MovieButton({ label, passingOnToButtonComponent }) {
  return (
    <div className="button-style" onClick={passingOnToButtonComponent}>
      {label}
    </div>
  );
}
