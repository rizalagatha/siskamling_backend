// src/services/laporan.service.js

const pool = require("../config/db");

function rentangBulan(bulan) {
  const [y, m] = bulan.split("-").map(Number);
  const start = `${bulan}-01`;
  const end =
    m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, "0")}-01`;
  return { start, end };
}

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

/**
 * Ringkasan patroli per tanggal dalam satu bulan (untuk pewarnaan kalender).
 * Tanggal yang tidak ada di hasil = tidak ada patroli (merah).
 */
async function getKalenderPatroli({ bulan, id_cabang, id_user }) {
  try {
    const { start, end } = rentangBulan(bulan);

    let sql = `
      SELECT
        DATE_FORMAT(a.waktu_mulai, '%Y-%m-%d') AS tanggal,
        COUNT(*)                               AS jumlah_patroli,
        COUNT(DISTINCT a.id_user)              AS jumlah_satpam,
        SUM(a.ada_temuan = 1)                  AS jumlah_temuan
      FROM absensi a
      JOIN titik t ON a.id_titik = t.id_titik
      WHERE a.waktu_mulai >= ? AND a.waktu_mulai < ?
    `;
    const params = [start, end];

    if (id_cabang) {
      sql += " AND t.id_cabang = ?";
      params.push(id_cabang);
    }
    if (id_user) {
      sql += " AND a.id_user = ?";
      params.push(id_user);
    }

    sql += " GROUP BY tanggal ORDER BY tanggal";

    const [rows] = await pool.execute(sql, params);

    return {
      bulan,
      tanggal: rows.map((r) => ({
        tanggal: r.tanggal,
        jumlah_patroli: Number(r.jumlah_patroli),
        jumlah_satpam: Number(r.jumlah_satpam),
        jumlah_temuan: Number(r.jumlah_temuan) || 0,
      })),
    };
  } catch (error) {
    console.error("Database error in getKalenderPatroli:", error);
    throw error;
  }
}

/**
 * Detail patroli pada satu tanggal, dikelompokkan per satpam.
 */
async function getKalenderDetail({ tanggal, id_cabang, id_user }) {
  try {
    let sql = `
      SELECT
        a.id_absensi,
        a.id_user,
        u.nama_lengkap                          AS petugas,
        c.nama_cabang                           AS cabang,
        t.nama_titik                            AS titik,
        DATE_FORMAT(a.waktu_mulai, '%H:%i')     AS jam_mulai,
        DATE_FORMAT(a.waktu_selesai, '%H:%i')   AS jam_selesai,
        a.ada_temuan,
        a.catatan
      FROM absensi a
      JOIN user u   ON a.id_user = u.id_user
      JOIN titik t  ON a.id_titik = t.id_titik
      JOIN cabang c ON t.id_cabang = c.id_cabang
      WHERE a.waktu_mulai >= ? AND a.waktu_mulai < DATE_ADD(?, INTERVAL 1 DAY)
    `;
    const params = [tanggal, tanggal];

    if (id_cabang) {
      sql += " AND c.id_cabang = ?";
      params.push(id_cabang);
    }
    if (id_user) {
      sql += " AND a.id_user = ?";
      params.push(id_user);
    }

    sql += " ORDER BY u.nama_lengkap, a.waktu_mulai";

    const [rows] = await pool.execute(sql, params);

    // Kelompokkan per satpam
    const bySatpam = new Map();
    for (const r of rows) {
      if (!bySatpam.has(r.id_user)) {
        bySatpam.set(r.id_user, {
          id_user: r.id_user,
          nama: r.petugas,
          cabang: r.cabang,
          jumlah_temuan: 0,
          patroli: [],
        });
      }
      const satpam = bySatpam.get(r.id_user);
      const adaTemuan = !!r.ada_temuan;
      if (adaTemuan) satpam.jumlah_temuan += 1;
      satpam.patroli.push({
        id_absensi: r.id_absensi,
        titik: r.titik,
        jam_mulai: r.jam_mulai,
        jam_selesai: r.jam_selesai,
        ada_temuan: adaTemuan,
        catatan: r.catatan,
      });
    }

    return { tanggal, satpam: [...bySatpam.values()] };
  } catch (error) {
    console.error("Database error in getKalenderDetail:", error);
    throw error;
  }
}

/**
 * Data untuk dropdown filter: semua cabang, dan daftar satpam
 * (opsional dipersempit per cabang).
 */
async function getKalenderFilter({ id_cabang }) {
  try {
    const [cabang] = await pool.execute(
      "SELECT id_cabang, nama_cabang AS nama FROM cabang ORDER BY nama_cabang",
    );

    let sql = `
      SELECT DISTINCT u.id_user, u.nama_lengkap AS nama
      FROM absensi a
      JOIN user u  ON a.id_user = u.id_user
      JOIN titik t ON a.id_titik = t.id_titik
      WHERE 1=1
    `;
    const params = [];
    if (id_cabang) {
      sql += " AND t.id_cabang = ?";
      params.push(id_cabang);
    }
    sql += " ORDER BY u.nama_lengkap";

    const [satpam] = await pool.execute(sql, params);
    return { cabang, satpam };
  } catch (error) {
    console.error("Database error in getKalenderFilter:", error);
    throw error;
  }
}

module.exports = {
  getStatusMingguan,
  createLaporan,
  getLaporanCheckpoint,
  getLaporanApar,
  getLaporanSaya,
  getKalenderPatroli,
  getKalenderDetail,
  getKalenderFilter,
};
