// src/controllers/absensi.controller.js

const absensiService = require('../services/absensi.service');

async function handleCreateAbsensi(req, res) {
    try {
        // Ambil data teks dari req.body
        const { id_user, id_shift, id_titik, ada_temuan, catatan } = req.body;
        
        // Ambil nama file dari req.file (hasil upload Multer)
        const foto_selfie = req.file ? req.file.filename : null;

        // Validasi input
        if (!id_user || !id_shift || !id_titik || !foto_selfie || ada_temuan === undefined) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Data user, shift, titik, selfie, dan status temuan dibutuhkan.' 
            });
        }

        // Panggil service dengan semua data
        const result = await absensiService.createAbsensi({ 
            id_user, 
            id_shift, 
            id_titik,
            foto_selfie,
            // Konversi string 'true'/'false' dari form-data menjadi boolean
            ada_temuan: ada_temuan === 'true', 
            catatan: catatan || null // Kirim null jika catatan kosong
        });

        res.status(201).json({ 
            status: 'success', 
            message: 'Data absensi dan laporan berhasil disimpan.',
            insertedId: result.insertId 
        });

    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: 'Terjadi kesalahan pada server.' 
        });
    }
}

module.exports = {
    handleCreateAbsensi
};
