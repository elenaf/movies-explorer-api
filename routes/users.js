const express = require('express');

const usersRoutes = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const {
  getCurrentUser,
  updateProfile,
} = require('../controllers/users');

usersRoutes.get('/me', getCurrentUser);
usersRoutes.patch('/me', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);

module.exports = usersRoutes;
