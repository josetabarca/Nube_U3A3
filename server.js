const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 5432;

app.use(bodyParser.json());
app.use(cors());

const corsOptions = {
    origin: 'https://tu-dominio-en-render.com',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432
});

app.get('/registros', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM registros');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/registros', async (req, res) => {
    const nuevoRegistro = req.body;
    try {
        const result = await pool.query('INSERT INTO registros (nombre, elemento, etapa) VALUES ($1, $2, $3) RETURNING *', [nuevoRegistro.nombre, nuevoRegistro.elemento, nuevoRegistro.etapa]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put('/registros/:id', async (req, res) => {
    const id = req.params.id;
    const datosActualizados = req.body;
    try {
        const result = await pool.query('UPDATE registros SET nombre = $1, elemento = $2, etapa = $3 WHERE id = $4 RETURNING *', [datosActualizados.nombre, datosActualizados.elemento, datosActualizados.etapa, id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.delete('/registros/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await pool.query('DELETE FROM registros WHERE id = $1', [id]);
        res.json({ message: 'Registro eliminado' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
