// src/routes/shift.routes.js

const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shift.controller');

// Endpoint: GET /api/shift
router.get('/', shiftController.handleGetAllShifts);

module.exports = router;
