const router = require('express').Router();
const {
  getUsers, createNewUser, getUserById, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

router.post('/users', createNewUser);
router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.patch('/users/me', updateUserInfo);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
