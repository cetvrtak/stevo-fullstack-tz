require('dotenv').config();
const mysql = require('mysql');

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
    initializeDatabase();
});

function initializeDatabase() {
    // Create database if it does not exist
    db.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``, (err, result) => {
        if (err) {
            console.error('Error creating database:', err);
            throw err;
        }
        console.log('Database created or already exists');

        // Use the database for further queries
        db.query(`USE \`${process.env.DB_NAME}\``, (err, result) => {
            if (err) {
                console.error('Error using database:', err);
                throw err;
            }
            console.log('Using database ' + process.env.DB_NAME);

            // Create Users table if it does not exist
            db.query('CREATE TABLE IF NOT EXISTS Users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), username VARCHAR(255) UNIQUE, password VARCHAR(255))', (err, result) => {
                if (err) {
                    console.error('Error creating Users table:', err);
                    throw err;
                }
                console.log('Users table created or already exists');
            });

            // Create Clients table if it does not exist
            db.query('CREATE TABLE IF NOT EXISTS Clients (account_number VARCHAR(255) PRIMARY KEY, surname VARCHAR(255), name VARCHAR(255), middle_name VARCHAR(255), date_of_birth DATE, tin VARCHAR(255) UNIQUE, responsible_full_name VARCHAR(255), status VARCHAR(255) DEFAULT "Not in work")', (err, result) => {
                if (err) {
                    console.error('Error creating Clients table:', err);
                    throw err;
                }
                console.log('Clients table created or already exists');
            });
        });
    });
}

module.exports = db;
