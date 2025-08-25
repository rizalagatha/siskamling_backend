// src/services/shift.service.js

const pool = require('../config/db');

/**
 * Service untuk mengambil semua data shift dari database.
 * Diurutkan berdasarkan waktu mulai.
 */
async function getAllShifts() {
    try {
        const sql = "SELECT id_shift, nama_shift, TIME_FORMAT(waktu_mulai, '%H:%i') as waktu_mulai, TIME_FORMAT(waktu_selesai, '%H:%i') as waktu_selesai FROM shift ORDER BY waktu_mulai";
        const [rows] = await pool.execute(sql);
        return rows;
    } catch (error) {
        console.error("Database error in getAllShifts:", error);
        throw error;
    }
}

module.exports = {
    getAllShifts
};
