const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento: Dónde guardar los archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../../Frontend/img'); 
    },
    filename: function (req, file, cb) {
        // Genera un nombre de archivo único para evitar colisiones
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

// Filtro de archivos: Aceptar solo imágenes
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true); 
    } else {
        cb(new Error('Solo se permiten archivos de imagen (jpg, jpeg, png).'), false);
    }
};

// Inicializa multer con la configuración
const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }
}).array('imagenes', 4);

module.exports = upload;