const express = require("express");
bodyParser = require('body-parser'),
  uuid = require('uuid');

const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect('mongodb://localhost:27017/cfDB'),

app.use(bodyParser.json());

//log requests to server
app.use(morgan("common"));

//import auth into index

// const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
// morgan = require("morgan");

let myLogger = (req, res, next) => {
  console.log(req.url);
  next();
};

let requestTime = (req, res, next) => {
  req.requestTime = Date.now();
  next();
};

// Users
//   .create({
//     name: req.body.name,
//     email: req.body.email,
//     favoriteMovies: req.body.favoriteMovies
//   })

app.use(myLogger);
app.use(requestTime);
app.use(morgan("common"));

//default text response when at /
app.get("/", (req, res) => {
  res.send("Welcome!");
});

//return JSON object when at /movies
app.get("/movies", (req, res) => {
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
app.get('/movies/title/:Title', (req, res) => {
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
app.get('/movies/directors/:DirectorName', (req, res) => {
  Movies.findOne({ "Director.Name": req.params.DirectorName})
    .then((directors) => {
      res.json(directors);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//get all users
app.get("/users", function (req, res) {
  Users.find()
    .then(function(users) {
      res.status(201).json(users);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// allow users to register
app.post ('/users', (req, res) => {
  console.log(333333, users)
  Users.findOne({ name: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + "already exists")
      } else {
        Users.create({
          "name": req.body.Username,
          "email": req.body.Email,
      })
    .then((user) => {
    res.status(201).json(user);
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  }
})
})


//   console.log(777777777777, req.body)
//   const userData = req.body;
//   const user = new Users(userData);

//   user.save()
//     .then(() => {
//       res.status(201).json({ message: 'User saved successfully' });
//     })
//     .catch(error => {
//       res.status(500).json({ error: 'An error occurred while saving the user' });
//     });

// // }
// // );

//get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ name: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ name: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

// Delete a user by username
app.delete('/users/:Username', (req, res) => {
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

//access documentation.html using express.static
app.use('/documentation', express.static('public'));

//err handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Listening on port 8080.');
})