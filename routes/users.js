const express = require('express');

const usersRoutes = require('express').Router();

const {
  getCurrentUser,
  updateProfile,
} = require('../controllers/users');

const { updateProfileValidation } = require('../validation/validation');

usersRoutes.get('/me', getCurrentUser);
usersRoutes.patch('/me', express.json(), updateProfileValidation, updateProfile);

module.exports = usersRoutes;
