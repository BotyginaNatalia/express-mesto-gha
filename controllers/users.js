/* eslint-disable no-param-reassign, no-underscore-dangle */

const User = require('../models/user');

const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_ERROR = 500;

module.exports.createNewUser = async (req, res) => {
  const user = new User({
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  });
  await user.save();
  if (!user) return res.status(BAD_REQUEST).send('Введены некорректные данные');
  return res.send(user);
};

module.exports.getUsers = async (req, res) => {
  const user = await User.find(req.params.id);
  if (!user) return res.status(INTERNAL_ERROR).send('Произошла ошибка на сервере');
  return res.send(user);
};

module.exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  User.findById(userId, req.body, { new: true })
    .then((user) => res.send(user))
    .catch(() => res.status(NOT_FOUND).send('Пользователь с указанным id не найден'));
};

module.exports.updateUserInfo = async (req, res) => {
  const userInfo = req.params.id;
  User.findByIdAndUpdate(userInfo, req.body, { new: true })
    .then((user) => res.send(user))
    .catch(() => res.status(BAD_REQUEST).send('Введены некорректные данные'));
};

module.exports.updateUserAvatar = async (req, res) => {
  const newUserAvatar = req.body.avatar;
  User.findByIdAndUpdate(req.user_id, { newUserAvatar }, { new: true })
    .then((user) => res.send(user))
    .catch(() => res.status(BAD_REQUEST).send('Введены некорректные данные'));
};
