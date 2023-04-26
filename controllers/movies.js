const Movie = require('../models/Movie');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

const {
  resStatuses,
} = require('../utils/constants');

const {
  OK,
  CREATED,
} = resStatuses;

const getMovies = async (req, res, next) => {
  try {
    const currentUser = req.user._id;
    const movies = await Movie.find({ owner: currentUser }).populate('owner');
    res.status(OK).send(movies);
  } catch (err) {
    next(err);
  }
};

const createMovie = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      nameRU,
      nameEN,
      movieId,
    } = req.body;
    const newMovie = await new Movie({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner,
      movieId,
      nameRU,
      nameEN,
    }).populate('owner');
    res.status(CREATED).send(await newMovie.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные'));
    } else {
      next(err);
    }
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const movie = await Movie.findById(_id);
    if (!movie) {
      throw new NotFoundError('Фильм не найден');
    }
    if (!movie.owner.equals(req.user._id)) {
      throw new ForbiddenError('Попытка удалить чужой фильм');
    }

    await Movie.deleteOne(movie);
    res.status(OK).send(movie);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Ошибка валидации ID'));
    } else {
      next(err);
    }
  }
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
