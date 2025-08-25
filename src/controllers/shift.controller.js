// src/controllers/shift.controller.js

const shiftService = require('../services/shift.service');

/**
 * Controller untuk menangani permintaan GET semua shift.
 */
async function handleGetAllShifts(req, res) {
    try {
        const shifts = await shiftService.getAllShifts();
        res.status(200).json(shifts);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
}

module.exports = {
    handleGetAllShifts
};
