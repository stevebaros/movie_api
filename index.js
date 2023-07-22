const express = require("express");
bodyParser = require('body-parser'),
  uuid = require('uuid');

const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/cfDB'),
  { useNewUrlParser: true, useUnifiedTopology: true }

  // Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Authentification & Login Endpoint
const passport = require('passport'); // JWT Authentification
app.use(passport.initialize());
require('./passport');

let auth = require('./auth')(app) // Login HTML Authentification

let myLogger = (req, res, next) => {
  console.log(req.url);
  next();
};

let requestTime = (req, res, next) => {
  req.requestTime = Date.now();
  next();
};

app.use(myLogger);
app.use(requestTime);
app.use(morgan("common"));

//default text response when at /
app.get("/", (req, res) => {
  res.send("Welcome!");
});

app.get('/movies', passport.authenticate('jwt', { session: false }),  (req, res) => {
   Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
}); //NEW CODE

//return JSON object when at /movies
app.get("/movies", passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// get a movie by the title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//get a director by name
app.get('/movies/directors/:DirectorName', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ "Director.Name": req.params.DirectorName })
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//get all users
app.get("/users", passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.find()
    .then(function (users) {
      res.status(201).json(users);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// allow users to register
app.post('/users', (req, res) => {
  const userData = req.body;
  const user = new Users(userData);

  user.save({
    Name: req.body.Name,
    Password: req.body.Password,
    Email: req.body.Email,
    Birthday: req.body.Birthday
  })
    .then(() => {
      res.status(201).json({ message: 'User saved successfully' });
    }) 
    .catch(error => {
      res.status(500).json({ error: `An error occurred while saving the user: ${error.message}` });
    });
}
);

//get a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ name: req.params.Username })
    .then((user) => {
      res.json(user);
    }) 
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.patch('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  const movieData = req.body;

  Users.findOneAndUpdate(
    { name: req.params.Username },
    { $set: movieData }
  )
    .then(() => {
      res.send({ message: "success" });
    })
    .catch(err => {
      res.status(500).send("Error" + err);
    });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/favoriteMovies/:MovieTitle', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ name: req.params.Username }, {
    $push: { favoriteMovies: req.params.MovieTitle }
  })
    .then(() => {
      res.send({ message: "success" });
    })
    .catch(err => {
      res.status(500).send("Error" + err);
    });;
});

// delete a movie (with exec)
app.delete('/users/:Username/favoriteMovies/:MovieTitle', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $pull: { favoriteMovies: req.params.MovieTitle } }
  )
    .exec() // Add the .exec() method to execute the query
    .then(() => {
      res.send({ message: "success" });
    })
    .catch(err => {
      res.status(500).send("Error" + err);
    });
});


// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ name: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//get a genre 
app.get('/movies/genres/:GenreName', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.GenreName })
    .then((movie) => {
      res.json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//access documentation.html using express.static
app.use('/documentation', express.static('public'));

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

// listen for requests
app.listen(8080, () => {
  console.log('Listening on port 8080.');
})