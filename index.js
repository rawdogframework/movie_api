const express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  morgan = require('morgan');

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
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// GET requests
// Hit main page
app.get('/', function (req, res) {
  res.status(200).send('Welcome to the Victorville Film Archives!');
});
// Get all movies in db
app.get('/movies', function (req, res) {
  Movies.find().then((movies) => res.status(200).json(movies));
});
// Get Movies by Title
app.get('/movies/:title', function (req, res) {
  let findMovie = topMovies.find((title) => {
    return title.title === req.params.title;
  });
  if (findMovie) {
    res.json(findMovie);
  } else {
    const message = 'Title not found in db';
    res.status(404).send(message);
  }
});
// Get Genre by Name
app.get('/movies/genre/:name', function (req, res) {
  let findGenre = genres.find((genre) => {
    return genre.genre === req.params.name;
  });
  if (findGenre) {
    res.status(200).json(findGenre);
  } else {
    const message = 'No Genre matching that name in the db';
    res.status(404).send(message);
  }
});
// Get Director by Name
app.get('/movies/directors/:name', function (req, res) {
  let findDirector = directors.find((name) => {
    return name.name === req.params.name;
  });
  if (findDirector) {
    res.status(200).json(findDirector);
  } else {
    const message = 'No Director matching that name in the db';
    res.status(404).send(message);
  }
});
// Create User Account
app.post('/users', function (req, res) {
  // db check if user already exists
  let checkDuplicate = userBase.find((user) => {
    return user.email === req.body.email;
  });
  if (checkDuplicate) {
    const message =
      'There is already an account assocaited with this email address';
    res.status(400).send(message);
  }
  // Check if username or pwd value is missing
  let newUser = {};
  newUser.email = req.body.email;
  newUser.pwd = req.body.pwd;
  newUser.dob = req.body.dob;
  newUser.username = req.body.username;
  newUser.favourites = [];
  if (newUser.email === '' || newUser.pwd === '') {
    const message = 'Missing email or password in request body';
    res.status(400).send(message);
  } else {
    // create ID for user
    newUser.id = uuid.v4();
    // push user to db
    userBase.push(newUser);
    res.status(201).json(newUser);
  }
});
// Deregister User Account
app.delete('/users/:id', function (req, res) {
  if (req.params.id === '') {
    res.status(400).send('Missing ID in request params');
  }
  // search userBase db for match req ID
  let userToDelete = userBase.find((user) => {
    return user.id === req.params.id;
  });
  if (userToDelete) {
    // Check pwd and email match req body
    console.log(userToDelete);
    console.log(req.body);
    console.log(req.params.id);
    if (
      userToDelete.pwd === req.body.pwd &&
      userToDelete.email === req.body.email
    ) {
      userBase = userBase.filter(function (obj) {
        return obj.id !== req.params.id;
      });
      res.status(201).send('Account ' + req.params.id + ' was deleted.');
    } else {
      res
        .status(404)
        .send(
          'Password or Email not matching credentials for the account with the passed ID'
        );
    }
  } else {
    res
      .status(404)
      .send('Account with the username ' + req.body.id + ' was not found.');
  }
});
// Update User Account
app.put('/users/update/:id', function (req, res) {
  if (req.params.id === '') {
    res.status(400).send('Missing ID in request params');
  }
  // search userBase db for match req ID
  let userToUpdate = userBase.find((user) => {
    return user.id === req.params.id;
  });
  if (userToUpdate) {
    // update user object
    userToUpdate.username = req.body.username || userToUpdate.username;
    userToUpdate.pwd = req.body.pwd || userToUpdate.pwd;
    userToUpdate.email = req.body.email || userToUpdate.email;
    userToUpdate.dob = req.body.dob || userToUpdate.dob;
    // confirmation
    res.status(201).json(userToUpdate);
  } else {
    const message = 'No User matching that ID in the db';
    res.status(404).send(message);
  }
});
// Update Favourites List by Title
app.post('/users/favourites/:id/', function (req, res) {
  if (req.params.id === '') {
    res.status(400).send('Missing ID in request params');
  }
  // Search userBase db for match req ID
  let addToFavourites = userBase.find((user) => {
    return user.id === req.params.id;
  });
  if (addToFavourites) {
    // Check for duplicates

    addToFavourites.favourites.push(req.body);
    res.status(201).json(addToFavourites);
  } else {
    const message = 'No Account matching that ID in the db.';
    res.status(404).send(message);
  }
});
// Remove Movie from Favourites List by Title
app.delete('/users/favourites/:id/', function (req, res) {
  if (req.params.id === '') {
    res.status(400).send('Missing ID in request params');
  }
  // Search userBase db for match req ID
  let removeFromFavourites = userBase.find((user) => {
    return user.id === req.params.id;
  });
  if (removeFromFavourites) {
    // Check for movie match
    let checkMovie = removeFromFavourites.favourites.find((movie) => {
      return movie.title === req.body.title;
    });
    if (checkMovie) {
      // Remove from list
      removeFromFavourites.favourites = removeFromFavourites.favourites.filter(
        function (obj) {
          return obj.title !== req.body.title;
        }
      );
      res.status(201).json(removeFromFavourites);
    } else {
      const message = 'No match for that movie in your favourites.';
      res.status(404).send(message);
    }
  } else {
    const message = 'No Account matching that ID in the db.';
    res.status(404).send(message);
  }
});

// listen for requests
app.listen(8080, () => console.log('Your app is listening on port 8080.'));
