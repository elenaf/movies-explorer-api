const express = require('express');

const moviesRoutes = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  createMovieValidation,
  deleteMovieValidation,
} = require('../validation/validation');

moviesRoutes.get('/', getMovies);
moviesRoutes.post('/', express.json(), createMovieValidation, createMovie);
moviesRoutes.delete('/:_id', deleteMovieValidation, deleteMovie);

module.exports = moviesRoutes;
