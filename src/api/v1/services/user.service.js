const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util")
const { mysqlService, Op } = require("./db/sql.service")

const { select, insert, selectCondition, transaction, update, _delete } = mysqlService()

const that = module.exports = {
    getUserBy: async ({ fields, where: condition }) => {
        try {

            await transaction(async (connection) => {
                await update("tb_user", { name: "trungpkl" }, `WHERE id = 1`, connection);
                await _delete('tb_user', `where id = 1`, connection)
                await update("tb_user", { name: "trunglala" }, `WHERE id = 2`, connection);
            })

            return;
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Get user success',
                data: await selectCondition('tb_user', { fields, ...condition })
            })
        } catch (error) {
            console.log(">>> ~ file: user.service.js:15 ~ getUserBy: ~ error: ", error)
            return serviceResult();
        }
    },
    createUser: async ({ name, email, password }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Create user success',
                data: await insert('tb_user', { name, email, password })
            })
        } catch (error) {
            console.log(">>> ~ file: user.service.js:28 ~ createUser: ~ error: ", error)
            return serviceResult();
        }
    },
    createUser_LocationNFTPiece: async ({
        totalPieceReceived,
        time,
        userId,
        locationNFTPieceId,
    }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Created User_LocationNFTPiece success',
                data: await insert('tb_User_LocationNFTPiece', {
                    totalPieceReceived,
                    time,
                    userId,
                    locationNFTPieceId,
                })
            });
        } catch (error) {
            console.log(">>> ~ file: user.service.js:45 ~ error: ", error)
            return serviceResult();
        }

    }
}