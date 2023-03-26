const express = require('express');
const app = express();
const port = 3000;

const users = [];

app.use(express.json());

//Register
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

//Login
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

//Get user
app.get('/user', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(401).send('Unauthorized');
  }

  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(400).send('User not found');
  }

  const userInfo = { name: user.name, email: user.email, username: user.username };
  res.send(userInfo);
});


//Logout
app.post('/logout', (req, res) => {
  
  req.query.username = null;
  res.send('User logged out successfully');
});

//Update user
app.put('/user', (req, res) => {
  const { username, name, email } = req.body;

  
  if (!username) {
    return res.status(401).send('Unauthorized');
  }

  
  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(400).send('User not found');
  }

  
  user.name = name;
  user.email = email;

  res.send('User info updated successfully');
});


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
