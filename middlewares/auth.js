const jwt = require('jsonwebtoken');
const { NotFoundErr } = require('../errors/NotFoundErr');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(NotFoundErr).send('Необходима авторизация пользователя');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (error) {
    return res.status(NotFoundErr).send('Необходима авторизация пользователя');
  }
  req.user = payload;
  next();
};
