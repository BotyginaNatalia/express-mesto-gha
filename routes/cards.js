const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getCards, createNewCard, deleteCard, setLikeToCard, removeLikeFromCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^(https?:\/\/)?[a-z0-9~_-]+\.[a-z]{2,9}(\/|:|\?[!-~]*)?$/),
  }),
}), createNewCard);

router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteCard,
);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), setLikeToCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), removeLikeFromCard);

module.exports = router;
