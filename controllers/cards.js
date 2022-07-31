const Card = require('../models/card');
const {
  BAD_REQUEST, NOT_FOUND, INTERNAL_ERROR, CREATED,
} = require('../errors');

module.exports.getCards = async (req, res) => {
  try {
    const card = await Card.find(req.params._id);
    res.send(card);
  } catch (error) {
    res.status(INTERNAL_ERROR).send('Произошла ошибка на сервере');
  }
};

module.exports.createNewCard = async (req, res) => {
  try {
    const card = new Card({
      name: req.body.name,
      link: req.body.link,
      owner: req.user._id,
    });
    await card.create();
    res.status(CREATED).send('Карточка создана');
  } catch (error) {
    res.status(BAD_REQUEST).send('Введены некорректные данные');
  }
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params._id)
    .then((card) => {
      if (!card) { throw res.status(NOT_FOUND).send('Карточка с данным id не найдена'); }
      res.send(card);
    })
    .catch(() => {
      res.status(INTERNAL_ERROR).send('Произошла ошибка на сервере');
    });
};

module.exports.setLikeToCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) return res.status(NOT_FOUND).send('Карточка с данным id не найдена');
      return res.status(INTERNAL_ERROR).send('Произошла ошибка на сервере');
    });
};

module.exports.removeLikeFromCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) return res.status(NOT_FOUND).send('Карточка с данным id не найдена');
      return res.status(INTERNAL_ERROR).send('Произошла ошибка на сервере');
    });
};
