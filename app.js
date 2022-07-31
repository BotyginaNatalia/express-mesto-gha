const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const PORT = 3000;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62e50aa1ecae6f64825c154e',
  };
  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  // eslint-disable-next-line no-template-curly-in-string, no-console
  console.log(`App listening on port ${PORT}`);
});
