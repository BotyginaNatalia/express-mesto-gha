const router = require('express').Router();
const {
  getCards, createNewCard, deleteCard, setLikeToCard, removeLikeFromCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', createNewCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', setLikeToCard);
router.delete('/cards/:cardId/likes', removeLikeFromCard);

module.exports = router;
