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

                // Insert sample data into Users table
                const users = [
                    { name: 'John Doe', username: 'johndoe', password: 'password1' },
                    { name: 'Jane Smith', username: 'janesmith', password: 'password2' },
                    { name: 'Alice Johnson', username: 'alicejohnson', password: 'password3' }
                ];
                users.forEach(user => {
                    db.query('INSERT INTO Users (name, username, password) VALUES (?, ?, ?)', [user.name, user.username, user.password], (err, result) => {
                        if (err) {
                            console.error('Error inserting into Users table:', err);
                            // You might want to handle duplicate entry errors gracefully here
                        } else {
                            console.log('Inserted into Users table:', user.username);
                        }
                    });
                });
            });

            // Create Clients table if it does not exist
            db.query('CREATE TABLE IF NOT EXISTS Clients (account_number VARCHAR(255) PRIMARY KEY, surname VARCHAR(255), name VARCHAR(255), middle_name VARCHAR(255), date_of_birth DATE, tin VARCHAR(255) UNIQUE, responsible_full_name VARCHAR(255), status VARCHAR(255) DEFAULT "Not in work")', (err, result) => {
                if (err) {
                    console.error('Error creating Clients table:', err);
                    throw err;
                }
                console.log('Clients table created or already exists');

                // Insert sample data into Clients table
                const clients = [
                    { account_number: '001', surname: 'Smith', name: 'John', middle_name: 'A', date_of_birth: '1980-01-01', tin: '123456789', responsible_full_name: 'John Doe', status: 'Not in work' },
                    { account_number: '002', surname: 'Doe', name: 'Jane', middle_name: 'B', date_of_birth: '1990-02-02', tin: '234567890', responsible_full_name: 'Jane Smith', status: 'Not in work' },
                    { account_number: '003', surname: 'Johnson', name: 'Alice', middle_name: 'C', date_of_birth: '2000-03-03', tin: '345678901', responsible_full_name: 'Alice Johnson', status: 'Not in work' },
                    { account_number: '004', surname: 'Williams', name: 'Bob', middle_name: 'D', date_of_birth: '1970-04-04', tin: '456789012', responsible_full_name: 'John Doe', status: 'Not in work' },
                    { account_number: '005', surname: 'Brown', name: 'Charlie', middle_name: 'E', date_of_birth: '1960-05-05', tin: '567890123', responsible_full_name: 'Jane Smith', status: 'Not in work' }
                ];
                clients.forEach(client => {
                    db.query('INSERT INTO Clients (account_number, surname, name, middle_name, date_of_birth, tin, responsible_full_name, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [client.account_number, client.surname, client.name, client.middle_name, client.date_of_birth, client.tin, client.responsible_full_name, client.status], (err, result) => {
                        if (err) {
                            console.error('Error inserting into Clients table:', err);
                            // You might want to handle duplicate entry errors gracefully here
                        } else {
                            console.log('Inserted into Clients table:', client.account_number);
                        }
                    });
                });
            });
        });
    });
}

module.exports = db;
