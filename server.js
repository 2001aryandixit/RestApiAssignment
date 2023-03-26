const express = require('express');
const app = express();
const port = 3000;

const users = [];

app.use(express.json());

app.post('/register', (req, res) => {
  const { name, username, email, password } = req.body;

  if (users.find(user => user.username === username)) {
    return res.status(400).send('Username already exists');
  }

  const timestamp = new Date();

  const user = { name, username, email, password, timestamp };
  users.push(user);
  res.send('User registered successfully');
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(400).send('Invalid username or password');
  }

  if (user.password !== password) {
    return res.status(400).send('Invalid username or password');
  }

  res.send('User logged in successfully');
});

// API to get info (name, email, username) for the logged in user
app.get('/user', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(401).send('Unauthorized');
  }

  // get user info
  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(400).send('User not found');
  }

  const userInfo = { name: user.name, email: user.email, username: user.username };
  res.send(userInfo);
});

// API to logout the user who is logged in
app.post('/logout', (req, res) => {
  // clear logged in user info
  req.query.username = null;
  res.send('User logged out successfully');
});

// API to update user info (name, email)
app.put('/user', (req, res) => {
  const { username, name, email } = req.body;

  // check if user is logged in
  if (!username) {
    return res.status(401).send('Unauthorized');
  }

  // get user info
  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(400).send('User not found');
  }

  // update user info
  user.name = name;
  user.email = email;

  res.send('User info updated successfully');
});

// start server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
