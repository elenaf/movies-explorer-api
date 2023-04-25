const dotenv = require('dotenv');

dotenv.config();

const { errors } = require('celebrate');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const err = require('./middlewares/err');

const app = express();

// подключить cors
app.use(cors({
  origin: [
    'http://movie.nomoredomains.monster/',
    'https://movie.nomoredomains.monster/',
    'https://localhost:3000',
    'http://localhost:3000',
  ],
}));

const { PORT = 3000, DATABASE_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

// логгер запросов
app.use(requestLogger);

// роутер
app.use(router);

// логгер ошибок
app.use(errorLogger);

// обработчик ошибок celebrate
app.use(errors());

// подключаем миддлвэр обработки ошибок
app.use(err);

// подключаемся к БД
async function connect() {
  await mongoose.connect(DATABASE_URL);
  await app.listen(PORT);
}

connect();
