const { combinePieces } = require('@v1/controllers/user.controller');
const express = require('express');
const router = express.Router();

router.route('/user/combine')
    .post(combinePieces)



module.exports = router;