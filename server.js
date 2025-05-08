const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 5432;

app.use(bodyParser.json());
app.use(cors());

const corsOptions = {
    origin: 'https://tu-dominio-en-render.com',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos');
});

app.get('/registros', (req, res) => {
    db.query('SELECT * FROM registros', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/registros', (req, res) => {
    const nuevoRegistro = req.body;
    db.query('INSERT INTO registros SET ?', nuevoRegistro, (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, ...nuevoRegistro });
    });
});

app.put('/registros/:id', (req, res) => {
    const id = req.params.id;
    const datosActualizados = req.body;
    db.query('UPDATE registros SET ? WHERE id = ?', [datosActualizados, id], (err, result) => {
        if (err) throw err;
        res.json({ id, ...datosActualizados });
    });
});

app.delete('/registros/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM registros WHERE id = ?', id, (err, result) => {
        if (err) throw err;
        res.json({ message: 'Registro eliminado' });
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en render:${port}`);
});
