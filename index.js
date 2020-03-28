const express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  morgan = require('morgan');
const app = express();

// User repo
let userBase = [
  {
    username: 'John Smith',
    pwd: 'XXXXXX',
    email: 'test@hotmail.com',
    dob: '01/04/1976',
    id: '0001',
    favourites: [
      {
        title: 'Tremor'
      },
      {
        title: 'City Slickers'
      }
    ]
  }
];

// Genre repo
let genres = [
  {
    genre: 'horror',
    description: 'etc etc'
  },
  {
    genre: 'Drama',
    description: 'etc etc'
  }
];

// Directos repo
let directors = [
  {
    name: 'John Smith',
    bio: 'A story about a guy',
    birthYear: '1946',
    deathYear: 'Still kicking',
    imageUrl: 'https://imagesite.com/495820953285'
  }
];

// Movies repo
let topMovies = [
  {
    title: 'Tremors',
    director: 'Ron Underwood',
    genre: 'Rock opera'
  },
  {
    title: 'Sleepers',
    director: 'Barry Levinson',
    genre: 'Rock opera'
  },
  {
    title: 'Apollo 13',
    director: 'Ron Howard',
    genre: 'Rock opera'
  },
  {
    title: 'Tremors 2',
    director: 'Ron Underwood',
    genre: 'Rock opera'
  },
  {
    title: 'Tremors 3',
    director: 'Ron Underwood',
    genre: 'Drama'
  },
  {
    title: 'City Slickers',
    director: 'Ron Underwood',
    genre: 'Drama'
  },
  {
    title: 'Might Young Joe',
    director: 'Ron Underwood',
    genre: 'Drama'
  },
  {
    title: 'Heart and Souls',
    director: 'Ron Underwood',
    genre: 'Drama'
  },
  {
    title: 'Speechless',
    director: 'Ron Underwood',
    genre: 'Drama'
  },
  {
    title: 'The Adventures of Pluto Nash',
    director: 'Ron Underwood',
    genre: 'Drama'
  }
];

// Midddleware
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// GET requests
// Hit main page
app.get('/', function(req, res) {
  res.send('Welcome to the Victorville Film Archives!');
});
// Get all movies in db
app.get('/movies', function(req, res) {
  res.json(topMovies);
});
// Get Movies by Title
app.get('/movies/:title', function(req, res) {
  let findMovie = topMovies.find(title => {
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
app.get('/movies/genre/:name', function(req, res) {
  let findGenre = genres.find(genre => {
    return genre.genre === req.params.name;
  });
  if (findGenre) {
    res.json(findGenre);
  } else {
    const message = 'No Genre matching that name in the db';
    res.status(404).send(message);
  }
});
// Get Director by Name
app.get('/movies/directors/:name', function(req, res) {
  let findDirector = directors.find(name => {
    return name.name === req.params.name;
  });
  if (findDirector) {
    res.json(findDirector);
  } else {
    const message = 'No Director matching that name in the db';
    res.status(404).send(message);
  }
});
// Create User Account
app.post('/users', function(req, res) {
  // db check if user already exists
  let checkDuplicate = userBase.find(user => {
    return user.email === req.body.email;
  });
  if (checkDuplicate) {
    const message =
      'There is already an account assocaited with this email address';
    res.status(400).send(message);
  }
  // Check if username or pwd value is missing
  let newUser = {};
  newUser.username = req.body.username;
  newUser.pwd = req.body.pwd;
  if (newUser.username === '' || newUser.pwd === '') {
    const message = 'Missing username or password in request body';
    res.status(400).send(message);
  } else {
    // create ID for user
    newUser.id = uuid.v4();
    // push user to db
    userBase.push(newUser);
    const message = 'Account successfully created with ID ' + newUser.id;
    res.status(200).send(message);
  }
});
// Deregister User Account
app.delete('/users/:id', function(req, res) {
  if (req.params.id === '') {
    res.status(400).send('Missing ID in request params');
  }
  // search userBase db for match req ID
  let userToDelete = userBase.find(user => {
    return user.id === req.params.id;
  });
  if (userToDelete) {
    // Check pwd and email match req body
    if (
      userToDelete.pwd === req.body.pwd &&
      userToDelete.email === req.body.email
    ) {
      userBase = userBase.filter(function(obj) {
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
app.put('/users/update/:id', function(req, res) {
  if (req.params.id === '') {
    res.status(400).send('Missing ID in request params');
  }
  // search userBase db for match req ID
  let userToUpdate = userBase.find(user => {
    return user.id === req.params.id;
  });
  if (userToUpdate) {
    // update user object
    userToUpdate.username = req.body.username || userToUpdate.username;
    userToUpdate.pwd = req.body.pwd || userToUpdate.pwd;
    userToUpdate.email = req.body.email || userToUpdate.email;
    userToUpdate.dob = req.body.dob || userToUpdate.dob;
    // confirmation
    const message =
      'Account successfully updated ' + '\n' + Object.values(userToUpdate);
    res.status(200).send(message);
  } else {
    const message = 'No User matching that ID in the db';
    res.status(404).send(message);
  }
});
// Update Favourites List by Title
app.post('/users/favourites/:id/', function(req, res) {
  if (req.params.id === '') {
    res.status(400).send('Missing ID in request params');
  }
  // Search userBase db for match req ID
  let addToFavourites = userBase.find(user => {
    return user.id === req.params.id;
  });
  if (addToFavourites) {
    // Check for duplicates

    addToFavourites.favourites.push(req.body);
    // loop through titles
    titles = '';
    addToFavourites.favourites.forEach(function(result) {
      titles += result.title + ' ';
    });
    const message =
      'Successfully added ' +
      req.body.title +
      ' to your favourites list. Current favourites list is \n' +
      titles;
    res.status(201).send(message);
  } else {
    const message = 'No Account matching that ID in the db.';
    res.status(404).send(message);
  }
});
// Remove Move from Favourites List by Title
app.delete('/users/favourites/:id/', function(req, res) {
  if (req.params.id === '') {
    res.status(400).send('Missing ID in request params');
  }
  // Search userBase db for match req ID
  let removeFromFavourites = userBase.find(user => {
    return user.id === req.params.id;
  });
  if (removeFromFavourites) {
    removeFromFavourites.favourites = removeFromFavourites.favourites.filter(
      function(obj) {
        return obj.title !== req.body.title;
      }
    );
    // loop through titles
    titles = '';
    removeFromFavourites.favourites.forEach(function(result) {
      titles += result.title + ' ';
    });
    const message =
      'Successfully removed ' +
      req.body.title +
      ' from your favourites list. Current favourites list is \n' +
      titles;
    res.status(201).send(message);
  } else {
    const message = 'No Account matching that ID in the db.';
    res.status(404).send(message);
  }
});

// listen for requests
app.listen(8080, () => console.log('Your app is listening on port 8080.'));
