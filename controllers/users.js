const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');

const {
  resStatuses,
  errCodes,
  SALT_ROUNDS,
} = require('../utils/constants');

const {
  OK,
  CREATED,
} = resStatuses;

const {
  MONGO_DUPLICATE_ERROR_CODE,
} = errCodes;

const { JWT_SECRET = 'secret' } = process.env;

const createUser = async (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await new User({
      email,
      password: hash,
      name,
    });
    res.status(CREATED).send(await (await newUser.save()).toJSON());
  } catch (err) {
    if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
      next(new ConflictError('Данный email уже зарегистрирован'));
    } else if (err.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные'));
    } else {
      next(err);
    }
  }
};

const login = async (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new UnauthorizedError('Unauthorized');
    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) throw new UnauthorizedError('Unauthorized');
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(OK).send({ message: 'Добро пожаловать!', token });
  } catch (err) {
    if (err.message === 'Unauthorized') {
      next(new UnauthorizedError('Некорректный email или пароль'));
    } else if (err.name === 'ValidationError') {
      next(new BadRequestError('Некорректный email или пароль'));
    } else {
      next(err);
    }
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('NotFound');
    res.status(OK).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Ошибка валидации ID'));
    } else if (err.message === 'NotFound') {
      next(new NotFoundError('Пользователь не найден'));
    } else {
      next(err);
    }
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { email, name } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { email, name },
      { new: true, runValidators: true },
    );
    if (!user) throw new NotFoundError('NotFound');
    res.status(OK).send(user);
  } catch (err) {
    if (err.message === 'NotFound') {
      next(new NotFoundError('Некорректные данные'));
    } else if (err.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные'));
    } else {
      next(err);
    }
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
