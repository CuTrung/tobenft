const { register, login } = require('@v1/controllers/auth.controller');
const express = require('express');
const router = express.Router();

router.route('/auth/register')
    .post(register)

router.route('/auth/login')
    .post(login)

module.exports = router;