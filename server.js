const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'materiales/'),
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'supersecretkey', resave: false, saveUninitialized: true }));

const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

function auth(req,res,next){
    if(req.session.user) next();
    else res.status(401).send("No autorizado");
}

// Login
app.post('/login', (req,res) => {
    const { username, password } = req.body;
    if(username === ADMIN_USER && password === ADMIN_PASS){
        req.session.user = username;
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.post('/logout', (req,res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Obtener cursos
app.get('/api/cursos', (req,res) => {
    const cursos = JSON.parse(fs.readFileSync('cursos.json'));
    res.json(cursos);
});

// Agregar curso
app.post('/api/cursos', auth, (req,res) => {
    const cursos = JSON.parse(fs.readFileSync('cursos.json'));
    cursos.push(req.body);
    fs.writeFileSync('cursos.json', JSON.stringify(cursos, null, 2));
    res.json({ success: true });
});

// Subir archivo
app.post('/upload', auth, upload.single('file'), (req,res) => {
    res.json({ success: true, filename: req.file.originalname });
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));