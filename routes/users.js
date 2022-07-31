const router = require('express').Router();
const {
  getUsers, createNewUser, getUserById, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

router.post('/', createNewUser);
router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
