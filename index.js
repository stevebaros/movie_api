const express = require("express");
bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();
morgan = require("morgan");
app.use(bodyParser.json());


let movies = [
  {
    "Title": "Stealing Beauty",
    "director": {
      "Name": "Bernardo Bertolucci",
      "Birth Date": 1941
    },
    "Genre": {
      "Name": "Drama",
      "description": "A young American comes to Italy for vacation to find the key to her mother`s mystery"
    },
    "ImageURL": "https://pics.filmaffinity.com/stealing_beauty_io_ballo_da_sola-799619154-mmed.jpg"
  },
  {
    "Title": "Ultimo Tango a Parigi",
    "director": {
      "Name": "Bernardo Bertolucci",
      "Birth Date": 1941
    },
    "Genre": {
      "Name": "Drama",
      "description": "description"
    },
    "ImageURL": "url"
  },
  {
    "Title": "The Dreamers",
    "director": {
      "Name": "Bernardo Bertolucci",
      "Birth Date": 1941
    },
    "Genre": {
      "Name": "Drama",
      "description": "The Dreamers is a meditation on youth and art — the ways in which life and art become conflated, how art becomes a part of us, and how we, in our youthful idealism, transform those we love into art"
    },
    "ImageURL": "url"
  },
  {
    "Title": "Little Buddha",
    "director": {
      "Name": "Bernardo Bertolucci",
      "Birth Date": 1941
    },
    "Genre": {
      "Name": "Drama",
      "description": "Tibetan Buddhist monks from a monastery in Bhutan, led by Lama Norbu, are searching for a child who is the rebirth of a great Buddhist teacher, Lama Dorje"
    },
    "ImageURL": "url"
  },
  {
    "Title": "Persona",
    "director": {
      "Name": "Ingmar Bergman",
      "Birth Date": 1918
    },
    "Genre": {
      "Name": "Drama",
      "description": "description"
    },
    "ImageURL": "url"
  },
  {
    "Title": "Viskningar och rop",
    "director": {
      "Name": "Ingmar Bergman",
      "Birth Date": 1918
    },
    "Genre": {
      "Name": "Drama",
      "description": "description"
    },
    "ImageURL": "url"
  },
  {
    "Title": "Smultronstället",
    "director": {
      "Name": "Ingmar Bergman",
      "Birth Date": 1918
    },
    "Genre": {
      "Name": "Drama",
      "description": "description"
    },
    "ImageURL": "url"
  },
  {
    "Title": "La notte",
    "director": {
      "Name": "Michelangelo Antonioni",
      "Birth Date": 1912,
    },
    "Genre": {
      "Name": "Drama",
      "description": "description"
    },
    "ImageURL": "url"
  },
  {
    "Title": "Zabriskie Point",
    "director": {
      "Name": "Michelangelo Antonioni",
      "Birth Date": 1912,
    },
    "Genre": {
      "Name": "Drama",
      "description": "description"
    },
    "ImageURL": "https://m.media-amazon.com/images/I/51EwYqplVjL._SX300_SY300_QL70_ML2_.jpg"
  },
  {
    "Title": "Crimson Peak",
    "director": {
      "Name": "Guillermo del Toro",
      "Birth Date": 1964
    },
    "Genre": {
      "Name": "Drama",
      "description": "description"
    },
    "ImageURL": "url"
  }
];

let users = [
  {    
    "name": "Maddie",
    "favoriteMovies": ["Stealing Beauty"],
    "id": 1,
  },
  {
    "name": "Lee",
    "favoriteMovies": ["Persona"],
    "id": 5,
  }
]

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


// GET requests
app.get('/', (req, res) => {
  let responseText = 'Welcome to my movie club';
  responseText += '<small>Requested at: ' + req.requestTime + '</small>';
  res.send(responseText);
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(movies);
  responseText += '<small>Requested at: ' + req.requestTime + '</small>';
  res.send(responseText);
});

app.get('/topmovies', (req, res) => {
  res.sendFile('public/ten_movies.html', { root: __dirname });
});

//Title
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find(movie => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  }
  else {
    res.status(400).send("no such movie")
  }
});

//Genre 
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  }
  else {
    res.status(400).send("no such genre")
  }
});

//DirectorsName
app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(movie => movie.director.Name === directorName).director;

  if (director) {
    res.status(200).json(director);
  }
  else {
    res.status(400).send("no such director")
  }
});

//Add NewUser
app.post('/users', (req, res) => {
  let newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);    
  } else {
    res.status(400).send("nmu");
  }
});

//Update
app.put('/users/:userid', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id);
  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("no name here");
  }
});

//ADD A MOVIE (POST)
app.post('/users/:id/favoriteMovies/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id === +id);
  if (user) {
    user.favoriteMovies.push.movieTitle;
    res.status(200).send(`${movieTitle} has been added to user ${id} array`);
  } else {
    res.status(400).send("no such user");
  }
});

//Delete Movie
app.delete('/users/:id/favoriteMovies/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id === +id);
  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id} array`);
  } else {
    res.status(400).send("no such movie");
  }
});

//Delete (deregister)
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find(user => user.id == id);
  if (user) {
    users = users.filter(user => user.id != id);
    res.status(200).send(`user ${id} has been deleted`);
  } else {
    res.status(400).send("no such user");
  }
});

app.use('/documentation', express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Listening on port 8080.');
});