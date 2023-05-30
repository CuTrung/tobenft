const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util");
const { mysqlService } = require("./db/sql.service")
const { select, update } = mysqlService();

const that = module.exports = {
    getLocationBy: async ({ fields, where: condition }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Get location success',
                data: await selectCondition('tb_locationnft', { fields, ...condition })
            })
        } catch (error) {
            console.log(">>> ~ file: location.service.js:14 ~ getLocationBy: ~ error: ", error)
            return serviceResult();
        }
    },
    getLocation_PieceBy: async ({ fields, where: condition }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Get location_piece success',
                data: await selectCondition('tb_locationnft_piece', { fields, ...condition })
            })
        } catch (error) {
            console.log(">>> ~ file: location.service.js:26 ~ getLocation_PieceBy: ~ error: ", error)
            return serviceResult();
        }
    },
    updateLocation_Piece: async ({ data, where: condition }) => {
        try {
            const { data: location_Piece, status } = await that.getLocation_PieceBy({
                fields: ['id'],
                where: condition
            });

            if (status === SERVICE_STATUS.ERROR) return serviceResult()

            if (location_Piece[0] === undefined) {
                return serviceResult({
                    status: SERVICE_STATUS.SUCCESS,
                    message: 'Not found any location_Piece to updated'
                })
            }
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Update location_Piece success',
                data: await update("tb_location_Piece", data, `where id = ${location_Piece[0].id}`)
            })
        } catch (error) {
            console.log(">>> ~ file: location.service.js:51 ~ updateLocation_Piece: ~ error: ", error)
            return serviceResult();
        }
    }
}