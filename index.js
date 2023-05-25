const express = require("express");
morgan = require("morgan");
const app = express();

let topMovies = [
  {
    title: "Stealing Beauty",
    director: "Bernardo Bertolucci"
  },
  {
    title: "Ultimo Tango a Parigi",
    director: "Bernardo Bertolucci"
  },
  {
    title: "The Dreamers",
    director: "Bernardo Bertolucci"
  },
  {
    title: "Little Buddha",
    director: "Bernardo Bertolucci"
  },
  {
    title: "Persona",
    director: "Ingmar Bergman"
  },
  {
    title: "Viskningar och rop",
    director: "Ingmar Bergman"
  },
  {
    title: "Smultronstället",
    director: "Ingmar Bergman"
  },
  {
    title: "La notte",
    director: "Michelangelo Antonioni"
  },
  {
    title: "Zabriskie Point",
    author: "Michelangelo Antonioni"
  },
  {
    title: "Crimson Peak",
    author: "Guillermo del Toro"
  }
];

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
  let responseText = 'Welcome to my movie club!';
  responseText += '<small>Requested at: ' + req.requestTime + '</small>';
  res.send(responseText);
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
  responseText += '<small>Requested at: ' + req.requestTime + '</small>';
  res.send(responseText);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});