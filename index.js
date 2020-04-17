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

//Local connection
// mongoose.connect('mongodb://localhost:27017/victorvilleDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Connection to Remote DB on MongoDBAtlas
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set('useFindAndModify', false);

const { check, validationResult } = require('express-validator');

const cors = require('cors');
app.use(cors());

/*
CORS - Allowed origins/domains
*/
var allowedOrigins = ['http://localhost:8080', 'https://vfa.herokuapp.com/'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn’t found on the list of allowed origins
        var message =
          'The CORS policy for this application doesn’t allow access from origin ' +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

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
app.post(
  '/users',
  // Validation logic
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  function (req, res) {
    // check the validation object for errors
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    var hashedPassword = Users.hashPassword(req.body.Password);
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
            Password: hashedPassword,
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
  }
);

// Deregister User Account
app.delete(
  '/users/:userId',
  passport.authenticate('jwt', { session: false }),
  // Validation logic
  [
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  function (req, res) {
    // check the validation object for errors
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    Users.findOne({ _id: req.params.userId })
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
              'User account with userId ' +
              req.params.userId +
              ' was successfully deleted';
            return res.status(200).send(message);
          } else {
            return res
              .status(400)
              .send('Credentials not matching account with that user id');
          }
        } else {
          return res.status(400).send('No account matching that user id in DB');
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
  '/users/update/:userId',
  passport.authenticate('jwt', { session: false }),
  // Validation logic
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  function (req, res) {
    // check the validation object for errors
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    // Check if id matches a user
    Users.findOne({ _id: req.params.userId })
      .then(function (user) {
        if (user) {
          Users.findOneAndUpdate(
            { _id: req.params.userId },
            {
              $set: {
                // --Remind for v2--
                // Add logic to only update what is in request body maybe can do that in UI i/e include any key/value that is not given
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
        } else {
          const message = 'No user matching that id in the db';
          res.status(404).send(message);
        }
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// Add Movie to Favourites List by Movie ID
app.post(
  '/users/:userId/favourites/:movieId/',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Users.find({ _id: req.params.userId }, function (err, user) {
      if (user) {
        // check duplicate
        let list = user[0].FavouriteMovies;
        if (list.includes(req.params.movieId)) {
          return res.status(400).send('Already movie in your favourites list');
        } else {
          // add to favourites
          Users.findOneAndUpdate(
            { _id: req.params.userId },
            {
              $push: { FavouriteMovies: req.params.movieId },
            },
            { new: true }
          )
            .then(function (updatedUser) {
              res
                .status(200)
                .json(
                  'Updated Favourites list: [' +
                    updatedUser.FavouriteMovies +
                    ']'
                );
            })
            .catch(function (err) {
              console.error(err);
              res.status(500).send('Error: ' + err);
            });
        }
      } else {
        console.error(err);
        res.status(500).send('Error: ' + err);
      }
    });
  }
);

// Remove Movie from Favourites List by Move ID
app.delete(
  '/users/:userId/favourites/:movieId/',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Users.find({ _id: req.params.userId }, function (err, user) {
      if (user) {
        // check duplicate
        let list = user[0].FavouriteMovies;
        console.log(user[0]);
        if (!list.includes(req.params.movieId)) {
          return res
            .status(400)
            .send('No movie matching that ID in the Favourites list');
        } else {
          // add to favourites
          Users.findOneAndUpdate(
            { _id: req.params.userId },
            {
              $pull: { FavouriteMovies: req.params.movieId },
            },
            { new: true }
          )
            .then(function (updatedUser) {
              res
                .status(200)
                .json(
                  'Movie with id ' +
                    req.params.movieId +
                    ' was succesfully deleted. Updated Favourites list: [' +
                    updatedUser.FavouriteMovies +
                    ']'
                );
            })
            .catch(function (err) {
              console.error(err);
              res.status(500).send('Error: ' + err);
            });
        }
      } else {
        console.error(err);
        res.status(500).send('Error: ' + err);
      }
    });
  }
);
// listen for requests
var port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', function () {
  console.log(`Listening on Port ${port}`);
});
