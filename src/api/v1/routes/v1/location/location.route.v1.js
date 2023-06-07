const { getAllLocation } = require('@v1/controllers/location.controller');
const express = require('express');
const router = express.Router();


router.route('/location')
    .get(getAllLocation)



module.exports = router;