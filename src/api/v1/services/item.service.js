const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util")
const { mysqlService } = require("./db/sql.service")
const { select, update } = mysqlService();
module.exports = {
    getItemBy: async ({ fields, where: condition, connection }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Get item success',
                data: await select('tb_Item', { fields, where: condition, connection })
            })
        } catch (error) {
            console.log(">>> ~ file: item.service.js:12 ~ getItemBy: ~ error: ", error)
            return serviceResult();
        }
    },
    updateItemBy: async ({ data, where: condition, connection }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Update item success',
                data: await update("tb_Item", {
                    data,
                    where: condition,
                    connection
                })
            })
        } catch (error) {
            console.log(">>> ~ file: item.service.js:29 ~ updateItemBy: ~ error: ", error)

            return serviceResult();
        }
    }
}