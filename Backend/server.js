const express = require('express');
const conectarDB = require('./config/db');
const usuarioRoutes = require('./routes/usuarioRoutes');
const autoRoutes = require('./routes/autoRoutes');
const cors = require('cors');

conectarDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/autos', autoRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT} 🚀`);
});