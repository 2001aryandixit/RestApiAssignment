const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const port=3000;

const app = express();
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB', error));

const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true, minlength: 3, maxlength: 25 },
  email: String,
  password: String,
  registrationTimestamp: Date
});

const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
  
  const user = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    registrationTimestamp: new Date()
  });
  
  
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (error) {
    res.status(400).send(error);
  }
});


app.post('/login', async (req, res) => {
  
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send('Invalid username or password');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid username or password');

  const token = jwt.sign({ _id: user._id }, 'secret');
  res.header('auth-token', token).send('Logged in successfully');
});

app.get('/user', async (req, res) => {
  
  const token = req.header('auth-token');
  const decoded = jwt.verify(token, 'secret');

  const user = await User.findById(decoded._id);
  if (!user) return res.status(400).send('User not found');

  res.send({
    name: user.name,
    email: user.email,
    username: user.username
  });
});

app.get('/logout', (req, res) => {
  res.header('auth-token', '').send('Logged out successfully');
});


app.patch('/user', async (req, res) => {

  const token = req.header('auth-token');
  const decoded = jwt.verify(token, 'secret');

  try {
    const updatedUser = await User.findByIdAndUpdate(decoded._id, {
      name: req.body.name,
      email: req.body.email
    }, { new: true });
    res.send(updatedUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
