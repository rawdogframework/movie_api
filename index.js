const express = require('express'),
  morgan = require('morgan');
const app = express();

// Movies repo
let topMovies = [
  {
    title: 'Tremors',
    director: 'Ron Underwood'
  },
  {
    title: 'Sleepers',
    director: 'Barry Levinson'
  },
  {
    title: 'Apollo 13',
    author: 'Ron Howard'
  },
  {
    title: 'Tremors 2',
    director: 'Ron Underwood'
  },
  {
    title: 'Tremors 3',
    director: 'Ron Underwood'
  },
  {
    title: 'City Slickers',
    director: 'Ron Underwood'
  },
  {
    title: 'Might Young Joe',
    director: 'Ron Underwood'
  },
  {
    title: 'Heart and Souls',
    director: 'Ron Underwood'
  },
  {
    title: 'Speechless',
    director: 'Ron Underwood'
  },
  {
    title: 'The Adventures of Pluto Nash',
    director: 'Ron Underwood'
  }
];

// Midddleware
app.use(morgan('common'));
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// GET requests
app.get('/', function(req, res) {
  res.send('Welcome to the Victorville Film Archives!');
});
app.get('/documentation', function(req, res) {
  res.sendFile('public/documentation.html', { root: __dirname });
});
app.get('/movies', function(req, res) {
  res.json(topMovies);
});

// listen for requests
app.listen(8080, () => console.log('Your app is listening on port 8080.'));
