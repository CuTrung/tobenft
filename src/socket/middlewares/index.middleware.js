const { serviceResult } = require("@v1/utils/api.util");
const { toDateTimeMySQL, addDays } = require("@v1/utils/index.util");

module.exports = {
    checkLogin: (socket, next) => {
        return next();
    },

    checkAuth: (socket, next) => {
        const { accessToken, refreshToken } = socket.handshake.auth;

        if (accessToken) {
            socket.mess = 'valid'
            console.log(">>> accessToken", accessToken);
            next();
        }
        socket.disconnect();
    },
}