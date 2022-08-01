const User = require('../models/user');
const {
  BAD_REQUEST, NOT_FOUND, INTERNAL_ERROR, CREATED,
} = require('../errors/errors');

module.exports.createNewUser = async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    });
    await user.save();
    res.status(CREATED).send('Пользователь создан');
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(BAD_REQUEST).send('Введены некорректные данные');
    } else {
      res.status(INTERNAL_ERROR).send('Произошла ошибка на сервере');
    }
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const user = await User.find(req.params._id);
    res.send(user);
  } catch (error) {
    res.status(INTERNAL_ERROR).send('Произошла ошибка на сервере');
  }
};

module.exports.getUserById = (req, res) => {
  const userId = req.params._id;
  User.findById(userId)
    .then((user) => {
      if (!user) { return res.status(NOT_FOUND).send('Пользователь с указанным id не найден'); }
      return res.send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BAD_REQUEST).send('Введены некорректные данные');
      } else {
        res.status(INTERNAL_ERROR).send('Произошла ошибка на сервере');
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
  const userInfo = req.params._id;
  User.findByIdAndUpdate(userInfo, req.body, { new: true, runValidators: true })
    .then((user) => {
      if (!user) { return res.status(NOT_FOUND).send('Пользователь с указанным id не найден'); }
      return res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send('Введены некорректные данные');
      } else {
        res.status(INTERNAL_ERROR).send('Произошла ошибка на сервере');
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const newUserAvatar = req.body.avatar;
  User.findByIdAndUpdate(req.user_id, { newUserAvatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) { return res.status(NOT_FOUND).send('Пользователь с указанным id не найден'); }
      return res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send('Введены некорректные данные');
      } else {
        res.status(INTERNAL_ERROR).send('Произошла ошибка на сервере');
      }
    });
};
