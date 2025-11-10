// src/controllers/user.controller.js

const bcrypt = require("bcryptjs");
const userService = require("../services/user.service");

/**
 * Controller to handle the login request.
 */
async function handleLogin(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Username dan password dibutuhkan.",
        });
    }

    const user = await userService.findUserByUsername(username);

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "Username tidak terdaftar." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "error", message: "Password salah." });
    }

    // Jika otentikasi berhasil
    res.status(200).json({
      status: "success",
      message: "Login berhasil!",
      // --- PERUBAHAN DI SINI ---
      user: {
        id: user.id_user,
        username: user.username,
        namaLengkap: user.nama_lengkap,
        idCabang: user.id_cabang,
        role: user.role, // <-- Kirim role ke frontend
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
}

module.exports = {
  handleLogin,
};
