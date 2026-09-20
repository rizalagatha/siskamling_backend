// src/controllers/laporan.controller.js

const laporanService = require("../services/laporan.service");
const RE_BULAN = /^\d{4}-(0[1-9]|1[0-2])$/;
const RE_TANGGAL = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

// "", undefined, atau "all" => null (tanpa filter)
function normalizeFilter(value) {
  if (value == null || value === "" || value === "all") return null;
  return value;
}

/**
 * Controller untuk mengecek status laporan mingguan.
 */
async function getStatus(req, res) {
  try {
    const { id_user } = req.params;
    const status = await laporanService.getStatusMingguan(id_user);
    res.status(200).json({
      status: "success",
      message: "Status berhasil diambil.",
      data: status,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Gagal mengambil status." });
  }
}

/**
 * Controller untuk membuat laporan APAR mingguan (tanpa foto).
 */
async function handleCreateLaporan(req, res) {
  try {
    // Data sekarang diambil dari req.body (JSON), bukan req.files
    const { id_user, id_cabang, sudah_dibalik, ada_temuan, catatan } = req.body;

    if (id_user == null || id_cabang == null || sudah_dibalik == null) {
      return res.status(400).json({
        status: "error",
        message: "Data (user, cabang, status dibalik) dibutuhkan.",
      });
    }

    const dataLaporan = {
      id_user,
      id_cabang,
      sudah_dibalik,
      ada_temuan: ada_temuan || false,
      catatan: catatan || null,
    };

    const insertedId = await laporanService.createLaporan(dataLaporan);

    res.status(201).json({
      status: "success",
      message: "Laporan APAR mingguan berhasil disimpan.",
      data: { id_laporan: insertedId },
    });
  } catch (error) {
    console.error("[Laporan APAR Controller Error]", error);
    res
      .status(500)
      .json({ status: "error", message: "Gagal menyimpan laporan." });
  }
}

/**
 * Controller untuk mengambil laporan checkpoint.
 * Menerima filter dari query string.
 */
async function handleGetLaporanCheckpoint(req, res) {
  try {
    const filters = {
      id_cabang: req.query.cabang, // ?cabang=1
      tanggal: req.query.tanggal, // ?tanggal=2025-11-10
    };
    const laporan = await laporanService.getLaporanCheckpoint(filters);
    res.status(200).json({ status: "success", data: laporan });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil laporan checkpoint.",
    });
  }
}

/**
 * Controller untuk mengambil laporan APAR.
 */
async function handleGetLaporanApar(req, res) {
  try {
    const filters = {
      id_cabang: req.query.cabang,
      tanggal: req.query.tanggal,
    };
    const laporan = await laporanService.getLaporanApar(filters);
    res.status(200).json({ status: "success", data: laporan });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Gagal mengambil laporan APAR." });
  }
}

/**
 * Controller untuk mengambil riwayat laporan harian (saya).
 */
async function handleGetLaporanSaya(req, res) {
  try {
    const { id_user } = req.params;
    if (!id_user) {
      return res
        .status(400)
        .json({ status: "error", message: "ID User dibutuhkan." });
    }
    const laporan = await laporanService.getLaporanSaya(id_user);
    res.status(200).json({ status: "success", data: laporan });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Gagal mengambil riwayat laporan." });
  }
}

/**
 * Ringkasan patroli per tanggal dalam satu bulan (untuk pewarnaan kalender).
 * Query: bulan=YYYY-MM, cabang (opsional), satpam (opsional)
 */
async function handleGetKalender(req, res) {
  try {
    const { bulan } = req.query;
    if (!RE_BULAN.test(bulan || "")) {
      return res.status(400).json({
        status: "error",
        message: "Parameter bulan wajib diisi dengan format YYYY-MM.",
      });
    }

    const data = await laporanService.getKalenderPatroli({
      bulan,
      id_cabang: normalizeFilter(req.query.cabang),
      id_user: normalizeFilter(req.query.satpam),
    });

    res.status(200).json({ status: "success", data });
  } catch (error) {
    console.error("[Laporan Kalender Controller Error]", error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data kalender laporan.",
    });
  }
}

/**
 * Detail patroli pada satu tanggal: satpam, titik, dan temuan.
 * Query: tanggal=YYYY-MM-DD, cabang (opsional), satpam (opsional)
 */
async function handleGetKalenderDetail(req, res) {
  try {
    const { tanggal } = req.query;
    if (!RE_TANGGAL.test(tanggal || "")) {
      return res.status(400).json({
        status: "error",
        message: "Parameter tanggal wajib diisi dengan format YYYY-MM-DD.",
      });
    }

    const data = await laporanService.getKalenderDetail({
      tanggal,
      id_cabang: normalizeFilter(req.query.cabang),
      id_user: normalizeFilter(req.query.satpam),
    });

    res.status(200).json({ status: "success", data });
  } catch (error) {
    console.error("[Laporan Kalender Detail Controller Error]", error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil detail patroli.",
    });
  }
}

module.exports = {
  getStatus,
  handleCreateLaporan,
  handleGetLaporanCheckpoint,
  handleGetLaporanApar,
  handleGetLaporanSaya,
  handleGetKalender,
  handleGetKalenderDetail,
};
