const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let bikes = [
    { id: 1, name: 'Stadsfiets', price: 15, available: 20 },
    { id: 2, name: 'Racefiets', price: 20, available: 10 }
];

let tours = [
    { id: 1, time: '10:00', price: 10, spots: 10 },
    { id: 2, time: '15:00', price: 10, spots: 10 }
];

let reservations = [];

// Endpoint to get bikes
app.get('/api/bikes', (req, res) => {
    res.json(bikes);
});

// Endpoint to get tours
app.get('/api/tours', (req, res) => {
    res.json(tours);
});

// Endpoint to reserve a bike or tour
app.post('/api/reserve', (req, res) => {
    const { type, item_id, customer_name, customer_email } = req.body;
    let item;
    if (type === 'bike') {
        item = bikes.find(b => b.id === item_id);
        if (item && item.available > 0) {
            item.available--;
        } else {
            return res.status(400).send({ message: 'Fiets niet beschikbaar' });
        }
    } else if (type === 'tour') {
        item = tours.find(t => t.id === item_id);
        if (item && item.spots > 0) {
            item.spots--;
        } else {
            return res.status(400).send({ message: 'Tour niet beschikbaar' });
        }
    }
    const reservation = { type, item_id, customer_name, customer_email };
    reservations.push(reservation);
    res.status(201).send({ message: 'Reservering ontvangen', reservation });
});

app.listen(port, () => {
    console.log(`Server draait op http://localhost:${port}`);
});