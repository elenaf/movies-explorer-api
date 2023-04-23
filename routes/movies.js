const express = require('express');

const moviesRoutes = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const validator = require('validator');

const validateUrl = (value, helpers) => {
  if (!validator.isURL(value)) {
    return helpers.error('Invalid url');
  }
  return value;
};

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

moviesRoutes.get('/', getMovies);
moviesRoutes.post('/', express.json(), celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().custom(validateUrl).required(),
    trailerLink: Joi.string().custom(validateUrl).required(),
    thumbnail: Joi.string().custom(validateUrl).required(),
    movieId: Joi.string().hex().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);
moviesRoutes.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex(),
  }),
}), deleteMovie);

module.exports = moviesRoutes;
