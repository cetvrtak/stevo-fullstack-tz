const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'your_database'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Auth route
app.post('/login', (req, res) => {
    const { login, password } = req.body;
    const sql = 'SELECT * FROM Users WHERE login = ?';
    db.query(sql, [login], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            const user = result[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (isMatch) {
                    const token = jwt.sign({ id: user.id }, 'your_jwt_secret');
                    res.json({ token });
                } else {
                    res.status(401).json({ msg: 'Invalid credentials' });
                }
            });
        } else {
            res.status(401).json({ msg: 'Invalid credentials' });
        }
    });
});

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) return res.status(401).json({ msg: 'Token is not valid' });
        req.user = decoded;
        next();
    });
};

// Client routes
app.get('/clients', authenticateToken, (req, res) => {
    const sql = 'SELECT * FROM Clients WHERE responsible_full_name = (SELECT full_name FROM Users WHERE id = ?)';
    db.query(sql, [req.user.id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.patch('/clients/:account_number', authenticateToken, (req, res) => {
    const { status } = req.body;
    const { account_number } = req.params;
    const sql = 'UPDATE Clients SET status = ? WHERE account_number = ?';
    db.query(sql, [status, account_number], (err, result) => {
        if (err) throw err;
        res.json({ msg: 'Status updated' });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
