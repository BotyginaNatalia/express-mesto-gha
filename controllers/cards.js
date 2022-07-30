/* eslint-disable no-param-reassign, no-underscore-dangle */

const Card = require('../models/card');

const BAD_REQUEST = 400;
const INTERNAL_ERROR = 500;

module.exports.getCards = async (req, res) => {
  const card = await Card.find(req.params.id);
  if (!card) return res.status(INTERNAL_ERROR).send('Произошла ошибка на сервере');
  return res.send(card);
};

module.exports.createNewCard = async (req, res) => {
  const card = new Card({
    name: req.body.name,
    link: req.body.link,
    owner: req.body.owner,
    likes: req.body.likes,
    createdAt: req.body.createdAt,
  });
  await card.save();
  if (!card) return res.status(BAD_REQUEST).send('Введены некорректные данные');
  return res.send(card);
};

module.exports.deleteCard = async (req, res) => {
  const cardId = req.params.id;
  await Card.findByIdAndDelete(cardId);
  return res.send('Карточка удалена');
};

module.exports.setLikeToCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user.id } },
  { new: true },
);

module.exports.removeLikeFromCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user.id } },
  { new: true },
);
