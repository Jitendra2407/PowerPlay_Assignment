const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { validateReservation } = require('../middleware/validation');

router.get('/', reservationController.getEventSummary);
router.post('/', validateReservation, reservationController.createReservation);
router.delete('/:reservationId', reservationController.cancelReservation);

module.exports = router;
