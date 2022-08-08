const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { login, createNewUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { NotFoundErr } = require('./errors/NotFoundErr');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.post('/signin', login);
app.post('/signup', createNewUser);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(auth);

app.use((req, res, next) => {
  next(new NotFoundErr('Маршрут не найден'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Произошла ошибка на сервере' : err.message;
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT);
