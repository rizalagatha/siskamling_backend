// src/services/absensi.service.js

const pool = require('../config/db');

/**
 * Service untuk menyimpan data absensi lengkap ke database.
 * @param {object} data - Data absensi lengkap.
 * @returns {Promise<object>} Hasil dari operasi insert.
 */
async function createAbsensi({ id_user, id_shift, id_titik, foto_selfie, ada_temuan, catatan }) {
    try {
        // Query INSERT diperbarui dengan kolom ada_temuan dan catatan
        const sql = `
            INSERT INTO absensi 
            (id_user, id_shift, id_titik, foto_selfie, ada_temuan, catatan) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await pool.execute(sql, [
            id_user, 
            id_shift, 
            id_titik, 
            foto_selfie, 
            ada_temuan, 
            catatan
        ]);
        
        return result;
    } catch (error) {
        console.error("Database error in createAbsensi:", error);
        throw error;
    }
}

module.exports = {
    createAbsensi
};
