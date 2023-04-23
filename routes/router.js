const express = require('express');

const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const usersRoutes = require('./users');
const moviesRoutes = require('./movies');

const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');

// роутинг для логина
router.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

// роутинг для регистрации
router.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

// роутинг для авторизации
router.use(auth);

// роутинг для пользователей
router.use('/users', usersRoutes);

// роутинг для фильмов
router.use('/movies', moviesRoutes);

// несуществующий путь
router.use(() => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
