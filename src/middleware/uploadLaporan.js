// src/middleware/uploadLaporan.js

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "src/uploads/laporan_apar"; // Folder baru
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // Kita bedakan nama filenya
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/octet-stream"
  ) {
    cb(null, true);
  } else {
    cb(new Error("File harus berupa gambar!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter: fileFilter,
});

// Middleware ini akan menangani 2 field file
module.exports = upload.fields([
  { name: "selfie", maxCount: 1 },
  { name: "foto_bukti", maxCount: 1 },
]);
