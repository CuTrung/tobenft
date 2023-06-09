const express = require('express');
const router = express.Router();
const authRouteV1 = require('./auth/auth.route.v1');
const pieceRouteV1 = require('./piece/piece.route.v1');
const locationRouteV1 = require('./location/location.route.v1');
const userRouteV1 = require('./user/user.route.v1');
const { checkVersion, checkInfoClient } = require('@v1/middlewares/index.middleware');
const { runMigrate } = require('@v1/controllers/index.controller');
const { checkJWT } = require('@v1/middlewares/auth.middleware');

router.all("*", checkInfoClient, checkJWT);

router.route('/auth*')
    .all(checkVersion({
        '2023-05-19': authRouteV1,
    }, { defaultVersion: '2023-05-19' }))

router.route('/piece*')
    .all(checkVersion({
        '2023-05-19': pieceRouteV1
    }, { defaultVersion: '2023-05-19' }))

router.route('/location*')
    .all(checkVersion({
        '2023-05-19': locationRouteV1
    }, { defaultVersion: '2023-05-19' }))


router.route('/user*')
    .all(checkVersion({
        '2023-05-19': userRouteV1
    }, { defaultVersion: '2023-05-19' }))

router.route('/db/migrate')
    .get(runMigrate)


module.exports = router;
