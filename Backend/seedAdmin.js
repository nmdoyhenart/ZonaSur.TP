// Importamos las herramientas necesarias
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Usuario = require('./models/Usuario');

dotenv.config();

const adminData = {
    nombre: 'Administrador',
    username: 'administrador',
    password: 'admin1234',
    //email: 'admin@zonasurcars.com',
    isAdmin: true
};

const crearAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB Conectado para crear admin...');

        const adminExistente = await Usuario.findOne({ username: adminData.username });
        if (adminExistente) {
            console.log('El usuario administrador ya existe.');
            return;
        }

        // Hashea la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        const admin = new Usuario({
            nombre: adminData.nombre,
            username: adminData.username,
            password: hashedPassword,
            //email: adminData.email,
            isAdmin: adminData.isAdmin
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