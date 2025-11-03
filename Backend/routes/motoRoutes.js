const express = require('express');
const { 
    obtenerMotos, 
    obtenerMotoPorId, 
    crearMoto, 
    actualizarMoto, 
    eliminarMoto 
} = require('../controllers/motoController');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', obtenerMotos);
router.get('/:id', obtenerMotoPorId);
router.delete('/:id', eliminarMoto);
router.post('/', upload, crearMoto);
router.put('/:id', upload, actualizarMoto);

module.exports = router;