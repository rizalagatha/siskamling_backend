// src/services/titik.service.js

const pool = require('../config/db');

/**
 * Service untuk mengambil semua titik patroli berdasarkan ID Cabang.
 * @param {number} idCabang - ID dari cabang.
 * @returns {Promise<Array>} Daftar titik patroli.
 */
async function getTitikByCabang(idCabang) {
    try {
        const sql = "SELECT id_titik, nama_titik, latitude, longitude FROM titik WHERE id_cabang = ?";
        const [rows] = await pool.execute(sql, [idCabang]);
        return rows;
    } catch (error) {
        console.error("Database error in getTitikByCabang:", error);
        throw error;
    }
}

module.exports = {
    getTitikByCabang
};
