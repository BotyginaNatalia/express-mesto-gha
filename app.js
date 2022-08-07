const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { login, createNewUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { InternalErr } = require('./errors/BadRequestErr');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.post('/signin', login);
app.post('/signup', createNewUser);
app.use(auth);

app.use((req, res, next) => {
  next(InternalErr('Произошла ошибка на сервере'));
});

app.listen(PORT);
