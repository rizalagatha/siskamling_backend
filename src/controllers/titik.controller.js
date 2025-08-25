// src/controllers/titik.controller.js

const titikService = require('../services/titik.service');

/**
 * Controller untuk menangani permintaan GET titik patroli berdasarkan cabang.
 */
async function handleGetTitikByCabang(req, res) {
    try {
        const { id_cabang } = req.params; // Ambil id_cabang dari URL

        if (!id_cabang) {
            return res.status(400).json({ message: 'ID Cabang dibutuhkan.' });
        }

        const titikList = await titikService.getTitikByCabang(id_cabang);
        res.status(200).json(titikList);

    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
}

module.exports = {
    handleGetTitikByCabang
};
