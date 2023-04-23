const dotenv = require('dotenv');

dotenv.config();

const { errors } = require('celebrate');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const router = require('./routes/router');
const { requestLogger, errorLogger } = require('./middlewares/logger');

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

// миддлвэр обработки ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

// подключаемся к БД
async function connect() {
  await mongoose.connect(DATABASE_URL);
  await app.listen(PORT);
}

connect();
