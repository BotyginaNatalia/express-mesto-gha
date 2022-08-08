const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BadRequestErr } = require('../errors/BadRequestErr');
const { InternalErr } = require('../errors/InternalErr');
const { NotFoundErr } = require('../errors/NotFoundErr');
const { ConflictErr } = require('../errors/ConflictErr');
const { Created } = require('../errors/Created');
const { AuthErr } = require('../errors/AuthErr');

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
    res.status(Created).send({
      data: {
        name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestErr('Введены некорректные данные'));
    } else if (error.code === 11000) {
      next(new ConflictErr('Пользователь с данным email уже существует'));
    }
    next(error);
  }
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (error) {
    next(new InternalErr('Произошла ошибка на сервере'));
  }
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) next(new NotFoundErr('Пользователь с указанным id не найден'));
      return res.send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(BadRequestErr('Введены некорректные данные'));
      } else {
        next(error);
      }
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const userInfo = req.user._id;
  User.findByIdAndUpdate(userInfo, req.body, { new: true, runValidators: true })
    .then((user) => {
      if (!user) next(new NotFoundErr('Пользователь с указанным id не найден'));
      return res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(BadRequestErr('Введены некорректные данные'));
      } else {
        next(error);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const newUserAvatar = req.body.avatar;
  User.findByIdAndUpdate(req.user_id, { newUserAvatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) next(new NotFoundErr('Пользователь с указанным id не найден'));
      return res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(BadRequestErr('Введены некорректные данные'));
      } else {
        next(error);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(() => {
      next(new AuthErr('Введены неправильные почта или пароль'));
    });
};

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.find(req.user._id);
    res.send(user);
  } catch (error) {
    next(new InternalErr('Произошла ошибка на сервере'));
  }
};
