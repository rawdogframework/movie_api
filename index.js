const express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  morgan = require('morgan');

const passport = require('passport');
require('./passport');

const app = express();
const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect('mongodb://localhost:27017/victorvilleDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Midddleware
app.use(morgan('common'));
app.use(bodyParser.json());
var auth = require('./auth')(app);
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

/*
API methods
*/

// Hit main page
app.get('/', function (req, res) {
  res.status(200).send('Welcome to the Victorville Film Archives!');
});
// Get all movies in db
app.get('/movies', passport.authenticate('jwt', { session: false }), function (
  req,
  res
) {
  Movies.find().then((movies) => res.status(200).json(movies));
});
// Get Movies by Title
app.get(
  '/movies/:title',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Movies.findOne({ Title: req.params.title }).then(function (title) {
      if (title) {
        res.status(200).json(title);
      } else {
        const message = 'Title not found in db';
        res.status(404).send(message);
      }
    });
  }
);
// Get Genre by Name
app.get(
  '/movies/genre/:name',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Movies.findOne({ 'Genre.Name': req.params.name }).then(function (genre) {
      if (genre) {
        res.status(200).json(genre.Genre);
      } else {
        const message = 'No Genre matching that name in the db';
        res.status(404).send(message);
      }
    });
  }
);
// Get Director by Name
app.get(
  '/movies/directors/:name',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Movies.findOne({ 'Director.Name': req.params.name }).then(function (
      director
    ) {
      if (director) {
        res.status(200).json(director.Director);
      } else {
        const message = 'No Director matching that name in the db';
        res.status(404).send(message);
      }
    });
  }
);
// Create User Account
app.post('/users', function (req, res) {
  // db check if user already exists
  Users.findOne({ Email: req.body.Email })
    .then(function (user) {
      if (user) {
        const message =
          'There is already an account associated with this email address';
        res.status(400).send(message);
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then(function (user) {
            res.status(201).json(user);
          })
          .catch(function (error) {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      }
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Deregister User Account
app.delete(
  '/users/:id',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Users.findOne({ _id: req.params.id })
      .then(function (user) {
        if (user) {
          // Check password and email match req body
          if (
            user.Email === req.body.Email &&
            user.Password === req.body.Password
          ) {
            // Delete user
            Users.deleteOne(user);
            const message =
              'User account with id ' +
              req.params.id +
              ' was successfully deleted';
            return res.status(200).send(message);
          } else {
            return res
              .status(400)
              .send('Credentials not matching account with that id');
          }
        } else {
          return res.status(400).send('No account matching that id in DB');
        }
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// Update User Account
app.put(
  '/users/update/:id',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Users.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }
    )
      .then(function (user) {
        res.status(200).json(user);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// Update Favourites List by Title
app.post(
  '/users/favourites/:id/',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Users.findOneAndUpdate(
      { _id: req.params.id },
      {
        /* 
      Check for duplicates
      */
        $push: { FavouriteMovies: req.body.id },
      },
      { new: true }
    )
      .then(function (updatedUser) {
        res
          .status(200)
          .json('Updated Favourites list: ' + updatedUser.FavouriteMovies);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// Remove Movie from Favourites List by Title
app.delete(
  '/users/favourites/:id/',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Users.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { FavouriteMovies: req.body.id } },
      { new: true }
    )
      .then(function (updatedUser) {
        res
          .status(200)
          .json(
            'Movie with id ' +
              req.body.id +
              ' was succesfully deleted. Updated Favourites list: ' +
              updatedUser.FavouriteMovies
          );
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// Private Users API for testing

// Create hardcode password?
app.get('/users', function (req, res) {
  Users.find().then((users) => res.status(200).json(users));
});

// listen for requests
app.listen(8080, () => console.log('Your app is listening on port 8080.'));
