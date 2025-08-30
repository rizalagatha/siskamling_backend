// src/services/absensi.service.js

const pool = require('../config/db');

async function createAbsensi({ id_user, id_shift, id_titik, foto_selfie, ada_temuan, catatan, waktu_mulai, waktu_selesai }) {
    try {
        const sql = `
            INSERT INTO absensi 
            (id_user, id_shift, id_titik, foto_selfie, ada_temuan, catatan, waktu_mulai, waktu_selesai) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await pool.execute(sql, [
            id_user, 
            id_shift, 
            id_titik, 
            foto_selfie, 
            ada_temuan, 
            catatan,
            waktu_mulai, 
            waktu_selesai 
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
