const { serviceResult } = require("@v1/utils/api.util");
const { toDateTimeMySQL, addDays } = require("@v1/utils/index.util");

module.exports = {
    checkLogin: (socket, next) => {
        return next();
    },

    checkAuth: (socket, next) => {
        const { token } = socket.handshake.auth;

        if (token) {
            socket.mess = 'valid'
            console.log(">>> Token", token);
            next();
        }
        socket.disconnect();
    },
}