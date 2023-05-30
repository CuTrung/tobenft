const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util")

module.exports = {
    getItemBy: async ({ fields, where: condition }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Get item success',
                data: await selectCondition('tb_item', { fields, ...condition })
            })
        } catch (error) {
            console.log(">>> ~ file: item.service.js:12 ~ getItemBy: ~ error: ", error)
            return serviceResult();
        }
    },
}