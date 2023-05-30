const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util")
const { mysqlService } = require("./db/sql.service")
const { select, update, selectCondition } = mysqlService()

const that = module.exports = {
    getPieceBy: async ({ fields, where: condition }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Get piece success',
                data: await selectCondition('tb_piece', { fields, ...condition })
            })
        } catch (error) {
            console.log(">>> ~ file: piece.service.js:14 ~ getPieceBy: ~ error: ", error)
            return serviceResult();
        }
    },
    updatePieceBy: async ({ data, where: condition }) => {
        try {
            const { data: piece, status } = await that.getPieceBy({
                fields: ['id'],
                where: condition
            });

            if (status === SERVICE_STATUS.ERROR) return serviceResult();

            if (piece[0] === undefined) {
                return serviceResult({
                    status: SERVICE_STATUS.SUCCESS,
                    message: 'Not found any piece to updated'
                })
            }
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Update piece success',
                data: await update("tb_piece", data, `where id = ${piece[0].id}`)
            })
        } catch (error) {
            console.log(">>> ~ file: piece.service.js:7 ~ getPieceBy: ~ error: ", error);
            return serviceResult();
        }
    }
}