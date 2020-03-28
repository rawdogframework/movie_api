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
  let findMovie = topMovies.filter(word => word.title === req.params.title);
  if (findMovie.length > 0) {
    res.json(
      findMovie.find(movie => {
        return movie.title === req.params.title;
      })
    );
  } else {
    const message = 'Title not found in db';
    res.status(404).send(message);
  }
});
// Get Genre by Title
app.get('/movies/genre/:name', function(req, res) {
  console.log(req.params.name);
  let findGenre = topMovies.filter(word => word.genre === req.params.name);
  if (findGenre.length > 0) {
    res.json(
      topMovies.find(movie => {
        return movie.genre === req.params.name;
      })
    );
  } else {
    const message = 'No movies matching that genre in the db';
    res.status(404).send(message);
  }
});
// Get Director by Name
app.get('/movies/directors/:name', function(req, res) {
  console.log(req.params.name);
  let findDirector = topMovies.filter(
    word => word.director === req.params.name
  );
  if (findDirector.length > 0) {
    // Add search for director object here

    res.json(
      topMovies.find(movie => {
        return movie.director === req.params.name;
      })
    );
  } else {
    const message = 'No Director matching that name in the db';
    res.status(404).send(message);
  }
});
// Create User Account
app.post('/users', function(req, res) {
  // db check if user already exists

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
    console.log('userbase looks like this ' + userBase);
    const message = 'Account successfully created with ID ' + newUser.id;
    res.status(200).send(message);
  }
});
// Deregister User Account
app.delete('/users', function(req, res) {
  console.log(req.body.username);
  let userToDelete = userBase.find(user => {
    return user.username === req.body.username;
  });
  console.log(userToDelete);
  if (userToDelete) {
    userBase = userBase.filter(function(obj) {
      return obj.username !== req.body.username;
    });
    res.status(201).send('Account ' + req.body.username + ' was deleted.');
  } else {
    res
      .status(404)
      .send(
        'Account with the username ' + req.body.username + ' was not found.'
      );
  }
});
// Update User Account
app.put('/users/update/:id', function(req, res) {
  if (req.params.id === '') {
    res.status(400).send('Missing ID in request params');
  }
  // search userBase db for match req ID
  console.log(req.params.id);
  let userToUpdate = userBase.find(user => {
    return user.id === req.params.id;
  });
  console.log(userToUpdate);
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
        console.log(obj);
        console.log(req.body.title);
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
