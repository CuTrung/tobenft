const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util");
const { mysqlService } = require("../db/sql.service")
const { select, insert } = mysqlService();

module.exports = {
    createUser_Item: async ({ userId, itemId, time, quantityItem, connection }) => {
        return serviceResult({
            status: SERVICE_STATUS.SUCCESS,
            message: 'Created user_item success',
            data: await insert('tb_User_Item', {
                data: [{ userId, itemId, time, quantityItem }],
                connection,
            })
        })
    },
    getItemBy: async ({ fields, where: condition, joins }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Get item success',
                data: await select('tb_Item', { fields, where: condition, joins })
            })
        } catch (error) {
            console.log(">>> ~ file: user.service.js:15 ~ getItemBy: ~ error: ", error)
            return serviceResult();
        }
    },
}