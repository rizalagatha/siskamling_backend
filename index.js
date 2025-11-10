// index.js

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Path diubah untuk menunjuk ke file routes yang baru
const absensiRoutes = require('./src/routes/absensi.routes');
const titikRoutes = require('./src/routes/titik.routes');
const userRoutes = require('./src/routes/user.routes');
const shiftRoutes = require('./src/routes/shift.routes');
const aparRoutes = require('./src/routes/apar.routes');

const app = express();
const port = process.env.API_PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));
app.use('/uploads/apar', express.static(path.join(__dirname, 'src/uploads/apar'))); 

// Menghubungkan Routes
// Semua request yang masuk ke /api/absensi akan ditangani oleh absensiRoutes
app.use('/api/absensi', absensiRoutes);
app.use('/api/titik', titikRoutes);
app.use('/api/user', userRoutes);
app.use('/api/shift', shiftRoutes);
app.use('/api/apar', aparRoutes); 

// Endpoint dasar untuk mengecek apakah server berjalan
app.get('/', (req, res) => {
    res.json({ message: 'Selamat datang di API Patroli.' });
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server API berjalan di http://localhost:${port}`);
});
