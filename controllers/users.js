const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BadRequestErr } = require('../errors/BadRequestErr');
const { InternalErr } = require('../errors/InternalErr');
const { NotFoundErr } = require('../errors/NotFoundErr');
const { Created } = require('../errors/Created');

module.exports.createNewUser = async (req, res, next) => {
  try {
    const user = new User({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
    });
    user.password = await user.hashPass(req.body.password);
    await user.save();
    res.status(Created).send('Пользователь создан');
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestErr('Введены некорректные данные'));
    }
    if (error.name === 'MongoError' && error.code === 11000) {
      next(new Error('Пользователь с данным email уже существует'));
    }
    next(new InternalErr('Произошла ошибка на сервере'));
  }
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const user = await User.find(req.params._id);
    res.send(user);
  } catch (error) {
    next(new InternalErr('Произошла ошибка на сервере'));
  }
};

module.exports.getUserById = (req, res, next) => {
  const userId = req.params._id;
  User.findById(userId)
    .then((user) => {
      if (!user) { return res.status(NotFoundErr).send('Пользователь с указанным id не найден'); }
      return res.send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(BadRequestErr('Введены некорректные данные'));
      } else {
        next(new InternalErr('Произошла ошибка на сервере'));
      }
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const userInfo = req.params._id;
  User.findByIdAndUpdate(userInfo, req.body, { new: true, runValidators: true })
    .then((user) => {
      if (!user) { return res.status(NotFoundErr).send('Пользователь с указанным id не найден'); }
      return res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(BadRequestErr('Введены некорректные данные'));
      } else {
        next(new InternalErr('Произошла ошибка на сервере'));
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const newUserAvatar = req.body.avatar;
  User.findByIdAndUpdate(req.user_id, { newUserAvatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) { return res.status(NotFoundErr).send('Пользователь с указанным id не найден'); }
      return res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(BadRequestErr('Введены некорректные данные'));
      } else {
        next(new InternalErr('Произошла ошибка на сервере'));
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(() => {
      res.status(NotFoundErr).send('Введены неправильные почта или пароль');
    });
};

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.find(req.params._id);
    res.send(user);
  } catch (error) {
    next(new InternalErr('Произошла ошибка на сервере'));
  }
};
