const Card = require('../models/card');
const { BadRequestErr } = require('../errors/BadRequestErr');
const { InternalErr } = require('../errors/InternalErr');
const { NotFoundErr } = require('../errors/NotFoundErr');
const { Created } = require('../errors/Created');
const { Success } = require('../errors/Success');

module.exports.getCards = async (req, res) => {
  try {
    const card = await Card.find(req.params._id);
    res.send(card);
  } catch (error) {
    res.status(InternalErr).send('Произошла ошибка на сервере');
  }
};

module.exports.createNewCard = async (req, res) => {
  try {
    const card = new Card({
      name: req.body.name,
      link: req.body.link,
      owner: req.user._id,
    });
    await card.save();
    res.status(Created).send('Карточка создана');
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(BadRequestErr).send('Введены некорректные данные');
    } else {
      res.status(InternalErr).send('Произошла ошибка на сервере');
    }
  }
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params._id)
    .then((card) => {
      if (!card) { return res.status(NotFoundErr).send('Карточка с данным id не найдена'); }
      return res.status(Success).send('Карточка успешно удалена');
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BadRequestErr).send('Введены некорректные данные');
      } else {
        res.status(InternalErr).send('Произошла ошибка на сервере');
      }
    });
};

module.exports.setLikeToCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) return res.status(NotFoundErr).send('Карточка с данным id не найдена');
      return res.status(Created).send('Лайк успешно поставлен');
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BadRequestErr).send('Введены некорректные данные');
      } else {
        res.status(InternalErr).send('Произошла ошибка на сервере');
      }
    });
};

module.exports.removeLikeFromCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) return res.status(NotFoundErr).send('Карточка с данным id не найдена');
      return res.status(Success).send('Лайк успешно удален');
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BadRequestErr).send('Введены некорректные данные');
      } else {
        res.status(InternalErr).send('Произошла ошибка на сервере');
      }
    });
};
