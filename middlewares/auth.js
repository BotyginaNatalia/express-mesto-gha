const jwt = require('jsonwebtoken');
const { AuthErr } = require('../errors/AuthErr');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthErr('Необходима авторизация пользователя');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (error) {
    throw new AuthErr('Необходима авторизация пользователя');
  }
  req.user = payload;
  next();
};
