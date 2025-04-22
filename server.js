const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const app = express();
const port = 3000;
const secretKey = 'clave_secreta';

app.use(bodyParser.json());
app.use(cors());


const corsOptions = {
    origin: 'http://127.0.0.1:5500', 
    optionsSuccessStatus: 200
    };
    
    app.use(cors(corsOptions));
    

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'registrosDB'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
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

app.post('/login', (req, res) => {
    const user = req.body;
    if (user.username === 'joset' && user.password === 'udg') {
        const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).send('Usuario o contraseña incorrectos');
    }
});

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token requerido');
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(500).send('Token inválido');
        req.user = decoded;
        next();
    });
}

app.use(verifyToken);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});