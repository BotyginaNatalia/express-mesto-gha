const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62e4efe021e970c240ff4b70',
  };
  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.listen(3000);
