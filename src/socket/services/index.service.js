module.exports = {
    getStudent: (socket) => {
        return async (...data) => {
            console.log(">>> check ", data);
            socket.emit('mess', { mess: 'Hello' })
        }
    }
}