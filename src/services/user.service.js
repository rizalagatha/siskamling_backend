// src/services/user.service.js

const pool = require('../config/db');

/**
 * Service to find a user by their username.
 * @param {string} username - The user's username.
 * @returns {Promise<object>} The user object or null if not found.
 */
async function findUserByUsername(username) {
    try {
        // --- PERUBAHAN DI SINI ---
        // Tambahkan nama_lengkap dan id_cabang ke dalam query SELECT
        const sql = "SELECT id_user, username, password, nama_lengkap, id_cabang FROM user WHERE username = ?";
        const [rows] = await pool.execute(sql, [username]);
        return rows[0] || null;
    } catch (error) {
        console.error("Database error in findUserByUsername:", error);
        throw error;
    }
}

module.exports = {
    findUserByUsername
};
