const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const {
  getUsers, getUserById, updateUserInfo, updateUserAvatar, getUser,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getUser);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
  }),
  getUserById,
);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/^(https?:\/\/)?[a-z0-9~_-]+\.[a-z]{2,9}(\/|:|\?[!-~]*)?$/),
  }),
}), updateUserAvatar);

module.exports = router;
