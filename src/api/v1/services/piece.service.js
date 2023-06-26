const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util")
const { mysqlService } = require("./db/sql.service")
const { select, update, } = mysqlService()

const that = module.exports = {
    getPieceBy: async ({ fields, where: condition, connection }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Get piece success',
                data: await select('tb_Piece', { fields, where: condition, connection })
            })
        } catch (error) {
            console.log(">>> ~ file: piece.service.js:14 ~ getPieceBy: ~ error: ", error)
            return serviceResult();
        }
    },
    updatePieceBy: async ({ data, where: condition, connection }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Update piece success',
                data: await update("tb_Piece", {
                    data,
                    where: condition,
                    connection
                })
            })
        } catch (error) {
            console.log(">>> ~ file: piece.service.js:7 ~ getPieceBy: ~ error: ", error);
            return serviceResult();
        }
    }
}