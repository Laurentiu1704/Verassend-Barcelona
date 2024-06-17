// server.js
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize SQLite database
let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

// Create tables
db.serialize(() => {
    db.run("CREATE TABLE bikes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, available INTEGER)");
    db.run("CREATE TABLE tours (id INTEGER PRIMARY KEY AUTOINCREMENT, time TEXT, price REAL, spots INTEGER)");
    db.run("CREATE TABLE reservations (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, item_id INTEGER, customer_name TEXT, customer_email TEXT)");
    
    // Insert initial data
    db.run("INSERT INTO bikes (name, price, available) VALUES ('Standard Bike', 15, 20)");
    db.run("INSERT INTO tours (time, price, spots) VALUES ('10:00', 10, 10), ('15:00', 10, 10)");
});

// API routes
app.get('/api/bikes', (req, res) => {
    db.all("SELECT * FROM bikes", [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

app.get('/api/tours', (req, res) => {
    db.all("SELECT * FROM tours", [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

app.post('/api/reserve', (req, res) => {
    const { type, item_id, customer_name, customer_email } = req.body;
    let sql = "";
    if (type === "bike") {
        sql = "UPDATE bikes SET available = available - 1 WHERE id = ?";
    } else if (type === "tour") {
        sql = "UPDATE tours SET spots = spots - 1 WHERE id = ?";
    }
    db.run(sql, [item_id], function(err) {
        if (err) {
            return console.error(err.message);
        }
        db.run("INSERT INTO reservations (type, item_id, customer_name, customer_email) VALUES (?, ?, ?, ?)", [type, item_id, customer_name, customer_email], function(err) {
            if (err) {
                return console.error(err.message);
            }
            res.json({ message: "Reservation successful", id: this.lastID });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
