// src/middleware/upload.js

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'src/uploads';

// Pastikan direktori upload ada, jika tidak, buat direktorinya
fs.mkdirSync(uploadDir, { recursive: true });

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Simpan ke 'src/uploads/'
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Selalu simpan file sebagai .jpg agar konsisten
    cb(null, 'selfie-' + uniqueSuffix + '.jpg');
  }
});

// Filter untuk memastikan hanya file gambar yang di-upload
const fileFilter = (req, file, cb) => {
  // Log untuk debugging, agar kita tahu tipe file apa yang masuk
  console.log(`[Upload Middleware] Menerima file: ${file.originalname}, tipe: ${file.mimetype}`);
  
  // --- PERBAIKAN DI SINI ---
  // Terima file jika mimetype-nya adalah gambar ATAU jika generic (octet-stream)
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/octet-stream') {
    cb(null, true); // Terima file
  } else {
    // Tolak file jika bukan gambar
    cb(new Error('File yang diupload harus berupa gambar!'), false); 
  }
};

// Inisialisasi Multer dengan konfigurasi di atas
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // Batas ukuran file 5MB
  },
  fileFilter: fileFilter
});

// Middleware ini akan mencari file dengan nama field 'selfie'
module.exports = upload.single('selfie');
