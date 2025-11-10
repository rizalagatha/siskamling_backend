// src/middleware/uploadApar.js

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "src/uploads/apar"; // Buat folder baru untuk foto APAR

// Pastikan direktori upload ada
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "apar-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter file gambar
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/octet-stream"
  ) {
    cb(null, true);
  } else {
    cb(new Error("File yang diupload harus berupa gambar!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter: fileFilter,
});

// Middleware ini akan mencari file dengan nama field 'foto_bukti'
// Jika tidak ada foto bukti, kita gunakan .none()
module.exports = upload.single("foto_bukti");
