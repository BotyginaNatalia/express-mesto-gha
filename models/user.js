const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,

  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(avatar) {
        return /(^https?:\/\/)?[a-z0-9~_-]+\.[a-z]{2,9}(\/|:|\?[!-~]*)?$/i.test(avatar);
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return /(^https?:\/\/)?[a-z0-9~_-]+\.[a-z]{2,9}(\/|:|\?[!-~]*)?$/i.test(email);
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.methods.hashPass = async (password) => bcrypt.hashSync(password, 8);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Введены неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Введены неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
