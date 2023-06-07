const { serviceResult } = require("@v1/utils/api.util");
const { mysqlService } = require("../db/sql.service")
const { select, insert } = mysqlService();


module.exports = {
    getUser_LocationNFTPieceBy: async ({ fields, where: condition }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Get User_LocationNFTPiece success',
                data: await select('tb_User_LocationNFTPiece', { fields, where: condition })
            })
        } catch (error) {
            console.log(">>> ~ file: user.service.js:42 ~ getUser_LocationNFTPieceBy: ~ error: ", error)

            return serviceResult();
        }
    },
    createUser_LocationNFTPiece: async ({
        quantityPiece,
        time,
        userId,
        locationNFTPieceId,
        connection
    }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Created User_LocationNFTPiece success',
                data: await insert('tb_User_LocationNFTPiece', {
                    data: [
                        {
                            quantityPiece,
                            time,
                            userId,
                            locationNFTPieceId,
                        }
                    ],
                    connection
                })
            });
        } catch (error) {
            console.log(">>> ~ file: user.service.js:45 ~ error: ", error)
            return serviceResult();
        }

    },
    getUser_LocationNFTPieceBy: async ({ fields, where: condition, queryAtTheEnd, connection }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Get User_LocationNFTPiece success',
                data: await select('tb_User_LocationNFTPiece', { fields, where: condition, queryAtTheEnd, connection })
            })
        } catch (error) {
            console.log(">>> ~ file: user.service.js:71 ~ getUser_LocationNFTPieceBy ~ error: ", error)
            return serviceResult();
        }
    },
}