const express = require('express');
const conectarDB = require('./config/db');
const usuarioRoutes = require('./routes/usuarioRoutes');
const autoRoutes = require('./routes/autoRoutes');
const motoRoutes = require('./routes/motoRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const cors = require('cors');
const path = require('path');

conectarDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/img', express.static(path.join(__dirname, '../Frontend/img')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/autos', autoRoutes);
app.use('/api/motos', motoRoutes);
app.use('/api/compras', reservaRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT} 🚀`);
});