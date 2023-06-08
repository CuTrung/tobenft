const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util");
const { mysqlService, Op } = require("../db/sql.service")
const { select, insert, update, _delete } = mysqlService();

module.exports = {
    getUser_PieceBy: async ({ fields, where: condition, joins, queryAtTheEnd, connection, }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Get User_Piece success',
                data: await select('tb_User_Piece', { fields, where: condition, joins, queryAtTheEnd, connection })
            })
        } catch (error) {
            console.log(">>> ~ file: user.service.js:223 ~ getUser_PieceBy: ~ error: ", error)

            return serviceResult();
        }
    },
    updateUser_Piece: async ({ data, fields, where: condition, connection }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Update User_Piece success',
                data: await update("tb_User_Piece", {
                    fields,
                    data,
                    where: condition,
                    connection
                })
            })
        } catch (error) {
            console.log(">>> ~ file: user.service.js:240 ~ updateUser_Piece: ~ error: ", error)
            return serviceResult();
        }
    },
    createUser_Piece: async ({ userId, pieceId, connection }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Created user_piece success',
                data: await insert('tb_User_Piece', {
                    data: [{ userId, pieceId }],
                    connection,
                })
            })
        } catch (error) {
            console.log(">>> ~ file: user.service.js:256 ~ createUser_Piece: ~ error: ", error)
            return serviceResult()
        }
    },
    deleteUser_PieceBy: async ({ where: condition, connection }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Get User_Piece success',
                data: await _delete('tb_User_Piece', { where: condition, connection })
            })
        } catch (error) {
            console.log(">>> ~ file: user.service.js:262 ~ getUser_PieceBy: ~ error: ", error)
            return serviceResult();
        }
    },
    createTrackingUser_Piece: async ({ userId, pieceId, time, quantityChanging, connection }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Created user_piece success',
                data: await insert('tb_TrackingUser_Piece', {
                    data: [{ userId, pieceId, time, quantityChanging }],
                    connection,
                })
            })
        } catch (error) {
            console.log(">>> ~ file: user.service.js:256 ~ createUser_Piece: ~ error: ", error)
            return serviceResult()
        }
    },
    getHistoryChangingPieces: async ({ userId }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Get TrackingUser_Piece success',
                data: await select('tb_TrackingUser_Piece tu', {
                    fields,
                    queryAtTheEnd: 'INNER JOIN tb_Piece p ON tu.pieceId = p.id',
                    where: {
                        [Op.AND]: [{ userId }]
                    }
                })
            })
        } catch (error) {
            console.log(">>> ~ file: user_Piece.service.js:92 ~ getHistoryChangingPieces: ~ error: ", error)

            return serviceResult();
        }
    }
}