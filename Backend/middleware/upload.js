const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    // Define dónde se guardarán los archivos
    destination: function (req, file, cb) {
        // Guarda las imágenes en /public/uploads
        cb(null, path.join(__dirname, '../public/uploads'));
    },

    // Define el nombre con el que se guardará cada archivo
    filename: function (req, file, cb) {
        // Usa un timestamp + extensión original para evitar conflictos
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg'
    ) {
        cb(null, true);  // Tipo permitido
    } else {
        cb(new Error('Solo se permiten archivos de imagen (jpg, jpeg, png).'), false);
    }
};

const upload = multer({
    storage,        // Dónde se guarda el archivo
    fileFilter,     // Qué tipos se permiten
    limits: { fileSize: 1024 * 1024 * 5 } // Límite: 5 MB
});

module.exports = upload;