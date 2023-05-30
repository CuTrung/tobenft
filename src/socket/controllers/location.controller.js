
const { pickupPiece } = require('../services/location.service');
module.exports = {
    pickupPiece: (socket) => socket.on('pickup-piece', pickupPiece(socket))
}