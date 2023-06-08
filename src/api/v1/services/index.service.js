const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util");
const { mysqlService } = require("@v1/services/db/sql.service");
const { dropAllTables } = mysqlService();
const createModels = require('@v1/models/index.model')
const runSeeders = require('@v1/seeders/index.seeder')


module.exports = {
    runMigrate: async () => {
        try {
            await dropAllTables()
            await createModels()
            await runSeeders()

            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Run migrate success'
            })
        } catch (error) {
            console.log(">>> ~ file: index.service.js:16 ~ runMigrate: ~ error: ", error)
            return serviceResult()
        }

    }
}