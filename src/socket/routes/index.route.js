
const { checkLogin, checkAuth } = require('../middlewares/index.middleware');
const { pickupPiece } = require('../controllers/location.controller');


module.exports = {
    initRoutesSocket: (io) => {
        // io.of('/student').use(checkLogin).on('connection', getStudent)
        // Ko check route '/'
        io.of(/.*/).use(checkAuth);
        io.use(checkAuth)

        io.of('/location').on('connection', pickupPiece)
    }
}