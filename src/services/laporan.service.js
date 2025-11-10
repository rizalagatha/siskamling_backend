// src/services/laporan.service.js

const pool = require("../config/db");

/**
 * Service untuk mengecek status laporan APAR mingguan.
 */
async function getStatusMingguan(idUser) {
  try {
    const sql = `
            SELECT id_laporan 
            FROM laporan_apar_mingguan 
            WHERE id_user = ? AND waktu_lapor >= NOW() - INTERVAL 7 DAY
            LIMIT 1
        `;
    const [rows] = await pool.execute(sql, [idUser]);

    // Jika ada laporan dalam 7 hari terakhir, statusnya 'Sudah Cek'
    if (rows.length > 0) {
      return "Sudah Cek";
    } else {
      return "Perlu Cek";
    }
  } catch (error) {
    console.error("Database error in getStatusMingguan:", error);
    throw error;
  }
}

/**
 * Service untuk menyimpan laporan APAR mingguan (tanpa foto).
 */
async function createLaporan(data) {
  const { id_user, id_cabang, sudah_dibalik, ada_temuan, catatan } = data;
  try {
    const sql = `
            INSERT INTO laporan_apar_mingguan 
            (id_user, id_cabang, sudah_dibalik, ada_temuan, catatan) 
            VALUES (?, ?, ?, ?, ?)
        `;
    const [result] = await pool.execute(sql, [
      id_user,
      id_cabang,
      sudah_dibalik,
      ada_temuan,
      catatan,
    ]);
    return result.insertId;
  } catch (error) {
    console.error("Database error in createLaporan:", error);
    throw error;
  }
}

/**
 * Service untuk mengambil laporan checkpoint (untuk admin).
 */
async function getLaporanCheckpoint(filters) {
  try {
    // Query dasar
    let sql = `
            SELECT 
                a.id_absensi,
                a.waktu_mulai, 
                a.waktu_selesai, 
                a.ada_temuan, 
                a.catatan, 
                a.foto_selfie,
                u.nama_lengkap AS petugas,
                t.nama_titik AS titik,
                c.nama_cabang AS cabang
            FROM absensi a
            JOIN user u ON a.id_user = u.id_user
            JOIN titik t ON a.id_titik = t.id_titik
            JOIN cabang c ON t.id_cabang = c.id_cabang
            WHERE 1=1
        `;
    const params = [];

    // Tambahkan filter dinamis
    if (filters.id_cabang) {
      sql += " AND c.id_cabang = ?";
      params.push(filters.id_cabang);
    }
    if (filters.tanggal) {
      sql += " AND DATE(a.waktu_mulai) = ?";
      params.push(filters.tanggal);
    }

    sql += " ORDER BY a.waktu_mulai DESC";

    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error("Database error in getLaporanCheckpoint:", error);
    throw error;
  }
}

/**
 * Service untuk mengambil laporan APAR mingguan (untuk admin).
 */
async function getLaporanApar(filters) {
  try {
    let sql = `
            SELECT 
                l.id_laporan,
                l.waktu_lapor,
                l.sudah_dibalik,
                l.ada_temuan,
                l.catatan,
                u.nama_lengkap AS petugas,
                c.nama_cabang AS cabang
            FROM laporan_apar_mingguan l
            JOIN user u ON l.id_user = u.id_user
            JOIN cabang c ON l.id_cabang = c.id_cabang
            WHERE 1=1
        `;
    const params = [];

    if (filters.id_cabang) {
      sql += " AND c.id_cabang = ?";
      params.push(filters.id_cabang);
    }
    if (filters.tanggal) {
      sql += " AND DATE(l.waktu_lapor) = ?";
      params.push(filters.tanggal);
    }

    sql += " ORDER BY l.waktu_lapor DESC";

    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error("Database error in getLaporanApar:", error);
    throw error;
  }
}

/**
 * Service untuk mengambil riwayat patroli harian (checkpoint & apar)
 * untuk user yang sedang login.
 */
async function getLaporanSaya(idUser) {
  try {
    // Query 1: Mengambil riwayat checkpoint hari ini
    const sqlCheckpoint = `
            SELECT 
                'checkpoint' AS tipe,
                a.waktu_selesai AS waktu,
                t.nama_titik AS nama_laporan,
                a.ada_temuan,
                a.catatan
            FROM absensi a
            JOIN titik t ON a.id_titik = t.id_titik
            WHERE a.id_user = ? AND DATE(a.waktu_selesai) = CURDATE()
        `;

    // Query 2: Mengambil riwayat laporan APAR hari ini
    const sqlApar = `
            SELECT 
                'apar' AS tipe,
                l.waktu_lapor AS waktu,
                'Laporan Cek APAR Mingguan' AS nama_laporan,
                l.ada_temuan,
                l.catatan
            FROM laporan_apar_mingguan l
            WHERE l.id_user = ? AND DATE(l.waktu_lapor) = CURDATE()
        `;

    // Gabungkan hasil kedua query
    const [checkpoints] = await pool.execute(sqlCheckpoint, [idUser]);
    const [aparReports] = await pool.execute(sqlApar, [idUser]);

    // Gabungkan dan urutkan berdasarkan waktu
    const combinedReports = [...checkpoints, ...aparReports];
    combinedReports.sort((a, b) => new Date(b.waktu) - new Date(a.waktu)); // Urutkan terbaru di atas

    return combinedReports;
  } catch (error) {
    console.error("Database error in getLaporanSaya:", error);
    throw error;
  }
}

module.exports = {
  getStatusMingguan,
  createLaporan,
  getLaporanCheckpoint, // <-- Ekspor fungsi baru
  getLaporanApar, // <-- Ekspor fungsi baru
  getLaporanSaya,
};
