const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const {
  getUsers, getUserById, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.number().required().max(24),
    }),
  }),
  getUserById,
);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
