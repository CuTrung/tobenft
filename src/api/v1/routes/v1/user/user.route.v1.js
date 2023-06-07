const { swapPiecesToCoin } = require('@v1/controllers/piece.controller');
const { combinePieces } = require('@v1/controllers/user.controller');
const express = require('express');
const router = express.Router();

router.route('/user/combine')
    .post(combinePieces)

router.route('/user/swap')
    .post(swapPiecesToCoin)



module.exports = router;