// hash_password.js
const bcrypt = require('bcryptjs');

const passwordToHash = '011'; // <-- Ganti password di sini
const saltRounds = 10;

bcrypt.hash(passwordToHash, saltRounds, function(err, hash) {
    if (err) {
        console.error("Error hashing password:", err);
        return;
    }
    console.log(`Password: ${passwordToHash}`);
    console.log(`Hash: ${hash}`);
});