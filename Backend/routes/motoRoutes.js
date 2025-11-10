const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
    obtenerMotos,
    obtenerMotoPorId,
    crearMoto,
    actualizarMoto,
    eliminarMoto
} = require('../controllers/motoController');

router.get('/', obtenerMotos);
router.get('/:id', obtenerMotoPorId);
router.post('/', upload, crearMoto);
router.put('/:id', upload, actualizarMoto);
router.delete('/:id', eliminarMoto);

module.exports = router;