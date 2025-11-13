const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin'); 

dotenv.config();

const adminData = {
    nombre: 'Administrador Script',
    username: 'administrador',
    password: 'admin1234'
};

const crearAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB Conectado para crear admin...');

        const adminExistente = await Admin.findOne({ username: adminData.username });
        if (adminExistente) {
            console.log('El usuario administrador ya existe.');
            return;
        }

        const admin = new Admin({
            nombre: adminData.nombre,
            username: adminData.username,
            password: adminData.password
            // El modelo se encarga del hash
        });

        await admin.save();
        console.log('Usuario administrador creado exitosamente.');

    } catch (error) {
        console.error('Error creando el usuario administrador:', error);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB Desconectado.');
    }
};

crearAdmin();