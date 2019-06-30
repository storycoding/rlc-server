const express = require('express');
const cors = require("cors");
const slashHome = require("./static/routes/home");
const app = express();
app.use(cors());

const port = 3000;

const checkCollision = require('./events/check-collision');
const findNextPosition = require('./events/find-next-position');
let state = require('./static/new-game-state');

app.post('/move', (req, res) => {
  if(!req.query || !req.query.direction) {
    res.send("no direction specified in the querystring");
    return;
  } 

  const direction = req.query.direction;
  let newPosition = findNextPosition(direction, state.hero);
  const collides = checkCollision(newPosition, state.grid);
  if(!collides) {
    state.hero = newPosition;
  }

  res.send(JSON.stringify(state.hero));
});

app.get('/', (req, res) => res.send(slashHome));
app.get('/game', (req, res) => res.send(JSON.stringify(state)));
// state request can be split for optimization
  // grid
  // players
  // specific player

app.listen(port, () => console.log(`Example app listening on port ${port}!`));