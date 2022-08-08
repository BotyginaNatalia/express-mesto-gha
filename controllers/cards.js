const Card = require('../models/card');
const { BadRequestErr } = require('../errors/BadRequestErr');
const { InternalErr } = require('../errors/InternalErr');
const { NotFoundErr } = require('../errors/NotFoundErr');
const { ForbiddenErr } = require('../errors/ForbiddenErr');
const { Created } = require('../errors/Created');
const { Success } = require('../errors/Success');

module.exports.getCards = async (req, res, next) => {
  try {
    const card = await Card.find({});
    res.send(card);
  } catch (error) {
    next(new InternalErr('Произошла ошибка на сервере'));
  }
};

module.exports.createNewCard = async (req, res, next) => {
  try {
    const card = new Card({
      name: req.body.name,
      link: req.body.link,
      owner: req.user._id,
    });
    await card.save();
    res.status(Created).send(card);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestErr('Введены некорректные данные'));
    } else {
      next(error);
    }
  }
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundErr('Карточка с данным id не найдена'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenErr('Нельзя удалить чужую карточку'));
      }
      return card.remove()
        .then(() => res.send({ message: 'Карточка успешно удалена' }));
    })
    .catch(next);
};

module.exports.setLikeToCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) next(new NotFoundErr('Карточка с данным id не найдена'));
      return res.status(Created).send({ message: 'Лайк успешно поставлен' });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestErr('Введены некорректные данные'));
      } else {
        next(error);
      }
    });
};

module.exports.removeLikeFromCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) return next(new NotFoundErr('Карточка с данным id не найдена'));
      return res.status(Success).send({ message: 'Лайк успешно удален' });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestErr('Введены некорректные данные'));
      } else {
        next(error);
      }
    });
};
