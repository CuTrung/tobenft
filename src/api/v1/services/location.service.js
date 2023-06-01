const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util");
const { mysqlService } = require("./db/sql.service")
const { select, update } = mysqlService();

const that = module.exports = {
    getLocationBy: async ({ fields, where: condition }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Get location success',
                data: await select('tb_locationnft', { fields, where: condition })
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
                data: await select('tb_locationnft_piece', { fields, where: condition })
            })
        } catch (error) {
            console.log(">>> ~ file: location.service.js:26 ~ getLocation_PieceBy: ~ error: ", error)
            return serviceResult();
        }
    },
    updateLocation_Piece: async ({ data, where: condition, connection }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Update location_Piece success',
                data: await update("tb_Locationnft_Piece", {
                    data,
                    connection,
                    where: condition
                })
            })
        } catch (error) {
            console.log(">>> ~ file: location.service.js:51 ~ updateLocation_Piece: ~ error: ", error)
            return serviceResult();
        }
    }
}