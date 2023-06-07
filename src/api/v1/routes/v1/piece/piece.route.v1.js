const { getPieceDetails, swapPiecesToCoin } = require('@v1/controllers/piece.controller');
const express = require('express');
const router = express.Router();

router.route('/piece/:id')
    .get(getPieceDetails)

router.route('/piece/swap').post(swapPiecesToCoin)



module.exports = router;