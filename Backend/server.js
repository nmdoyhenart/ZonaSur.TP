const express = require('express');
const conectarDB = require('./config/db');
const usuarioRoutes = require('./routes/usuarioRoutes');
const adminRoutes = require('./routes/adminRoutes');
const autoRoutes = require('./routes/autoRoutes');
const motoRoutes = require('./routes/motoRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');

conectarDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: 'tuPalabraSecretaMuyLargaYCompleja', // Clave para firmar la cookie
    resave: false, // No vuelve a guardar si no hay cambios
    saveUninitialized: false, // No guarda sesiones vacías
    cookie: {
        secure: false,
        httpOnly: true, // Front no puede leer la cookie
        maxAge: 1000 * 60 * 5 // 1000ms * 60s * 5min = 300000ms
    }
}));

app.use('/img', express.static(path.join(__dirname, '../Frontend/img')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/autos', autoRoutes);
app.use('/api/motos', motoRoutes);
app.use('/api/reservas', reservaRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT} 🚀`);
});