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
      return res.status(400).json({
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

    if (user.aktif === 0) {
      return res.status(403).json({
        status: "error",
        message: "Akun Anda dinonaktifkan. Hubungi administrator.",
      });
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

const ADMIN_ROLES = ["admin"]; // sesuaikan dengan hasil SELECT DISTINCT role

async function requireAdmin(req, res, next) {
  try {
    const requester = await userService.findUserById(req.header("x-user-id"));
    if (
      !requester ||
      requester.aktif === 0 ||
      !ADMIN_ROLES.includes(requester.role)
    ) {
      return res
        .status(403)
        .json({ status: "error", message: "Akses ditolak." });
    }
    req.requester = requester;
    next();
  } catch (e) {
    res
      .status(500)
      .json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
}

async function handleList(req, res) {
  try {
    const users = await userService.listUsers();
    res.json({ status: "success", data: users });
  } catch (e) {
    res
      .status(500)
      .json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
}

async function handleSetStatus(req, res) {
  try {
    const id = Number(req.params.id);
    const { aktif } = req.body;
    if (!Number.isInteger(id) || typeof aktif !== "boolean") {
      return res
        .status(400)
        .json({ status: "error", message: "Data tidak valid." });
    }
    if (id === req.requester.id_user && aktif === false) {
      return res.status(400).json({
        status: "error",
        message: "Tidak bisa menonaktifkan akun sendiri.",
      });
    }
    const ok = await userService.setAktif(id, aktif);
    if (!ok)
      return res
        .status(404)
        .json({ status: "error", message: "User tidak ditemukan." });
    res.json({
      status: "success",
      message: aktif ? "Akun diaktifkan." : "Akun dinonaktifkan.",
    });
  } catch (e) {
    res
      .status(500)
      .json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
}

async function handleCreate(req, res) {
  try {
    const username = (req.body.username || "").trim();
    const password = req.body.password || "";
    const namaLengkap = (req.body.nama_lengkap || "").trim();
    const idCabang = Number(req.body.id_cabang);

    if (!username || !namaLengkap || !Number.isInteger(idCabang)) {
      return res
        .status(400)
        .json({ status: "error", message: "Data tidak lengkap." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ status: "error", message: "Password minimal 6 karakter." });
    }
    if (await userService.findUserByUsername(username)) {
      return res
        .status(409)
        .json({ status: "error", message: "Username sudah dipakai." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = await userService.createUser({
      username,
      passwordHash,
      namaLengkap,
      idCabang,
    });
    res
      .status(201)
      .json({ status: "success", message: "Akun satpam dibuat.", id });
  } catch (e) {
    res
      .status(500)
      .json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
}

module.exports = {
  handleLogin,
  requireAdmin,
  handleList,
  handleSetStatus,
  handleCreate,
};
