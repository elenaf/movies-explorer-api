const express = require('express');

const router = express.Router();
const usersRoutes = require('./users');
const moviesRoutes = require('./movies');

const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { loginValidation, createUserValidation } = require('../validation/validation');

// роутинг для логина
router.post('/signin', express.json(), loginValidation, login);

// роутинг для регистрации
router.post('/signup', express.json(), createUserValidation, createUser);

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
