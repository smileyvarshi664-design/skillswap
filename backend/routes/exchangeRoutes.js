const express = require('express');
const router = express.Router();
const { getMyExchanges, completeExchange } = require('../controllers/exchangeController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMyExchanges);
router.put('/:id/complete', protect, completeExchange);

module.exports = router;
