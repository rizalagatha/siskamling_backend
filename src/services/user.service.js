// src/services/user.service.js

const pool = require("../config/db");

/**
 * Service to find a user by their username.
 * @param {string} username - The user's username.
 * @returns {Promise<object>} The user object or null if not found.
 */
async function findUserByUsername(username) {
  try {
    // --- PERUBAHAN DI SINI ---
    // Tambahkan 'role' ke dalam query SELECT
    const sql =
      "SELECT id_user, username, password, nama_lengkap, id_cabang, role, aktif FROM user WHERE username = ?";

    const [rows] = await pool.execute(sql, [username]);
    return rows[0] || null;
  } catch (error) {
    console.error("Database error in findUserByUsername:", error);
    throw error;
  }
}

async function findUserById(id) {
  const [rows] = await pool.execute(
    "SELECT id_user, username, role, aktif FROM user WHERE id_user = ?",
    [id],
  );
  return rows[0] || null;
}

async function listUsers() {
  const [rows] = await pool.execute(
    "SELECT id_user, username, nama_lengkap, id_cabang, role, aktif FROM user ORDER BY nama_lengkap",
  );
  return rows;
}

async function setAktif(id, aktif) {
  const [result] = await pool.execute(
    "UPDATE user SET aktif = ? WHERE id_user = ?",
    [aktif ? 1 : 0, id],
  );
  return result.affectedRows > 0;
}

module.exports = { findUserByUsername, findUserById, listUsers, setAktif };
