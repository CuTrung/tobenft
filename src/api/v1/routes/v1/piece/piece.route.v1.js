const { getPieceDetails } = require('@v1/controllers/piece.controller');
const express = require('express');
const router = express.Router();

router.route('/piece/:pieceId')
    .get(getPieceDetails)



module.exports = router;