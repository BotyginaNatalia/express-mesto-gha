const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return /(^https?:\/\/)?[a-z0-9~_-]+\.[a-z]{2,9}(\/|:|\?[!-~]*)?$/i.test(link);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: {
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'user',
  },
  createdAt: {
    type: Date,
    required: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
