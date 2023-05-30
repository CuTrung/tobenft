const { getStudent } = require('../services/index.service');
module.exports = {
    getStudent: (socket) => {
        socket.on('getStudent', getStudent(socket))
    }
}