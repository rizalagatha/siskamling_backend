// src/routes/user.routes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/login', userController.handleLogin);

module.exports = router;