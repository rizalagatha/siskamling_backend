// src/controllers/user.controller.js

const bcrypt = require('bcryptjs'); // Pastikan bcryptjs di-import
const userService = require('../services/user.service');

async function handleLogin(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ status: 'error', message: 'Username dan password dibutuhkan.' });
        }

        const user = await userService.findUserByUsername(username);

        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Username tidak terdaftar.' });
        }
        
        // --- PERBAIKAN DI SINI ---
        // Gunakan bcrypt.compare untuk membandingkan password dari aplikasi dengan hash di database
        const isMatch = await bcrypt.compare(password, user.password);

        // Baris ini HANYA untuk password teks biasa dan sekarang salah
        // const isMatch = (password === user.password); 

        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Password salah.' });
        }

        // Jika otentikasi berhasil
        res.status(200).json({ 
            status: 'success', 
            message: 'Login berhasil!', 
            user: { 
                id: user.id_user, 
                username: user.username,
                namaLengkap: user.nama_lengkap,
                idCabang: user.id_cabang
            } 
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server.' });
    }
}

module.exports = {
    handleLogin
};
