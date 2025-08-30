// src/controllers/absensi.controller.js

const absensiService = require('../services/absensi.service');

async function handleCreateAbsensi(req, res) {
    try {
        const { id_user, id_shift, id_titik, ada_temuan, catatan, waktu_mulai, waktu_selesai } = req.body;
        const foto_selfie = req.file ? req.file.filename : null; // tetap ambil file kalau ada

        // Validasi wajib, selfie boleh null
        if (!id_user || !id_shift || !id_titik || ada_temuan === undefined) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Data patroli tidak lengkap.' 
            });
        }

        const result = await absensiService.createAbsensi({ 
            id_user, 
            id_shift, 
            id_titik, 
            foto_selfie, // bisa null
            ada_temuan: ada_temuan === 'true', 
            catatan: catatan || null,
            waktu_mulai, 
            waktu_selesai 
        });

        res.status(201).json({ 
            status: 'success', 
            message: 'Data absensi dan laporan berhasil disimpan.',
            insertedId: result.insertId 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Terjadi kesalahan pada server.' 
        });
    }
}

module.exports = {
    handleCreateAbsensi
};
