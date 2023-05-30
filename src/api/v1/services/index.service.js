const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util");



module.exports = {
    runMigrate: async () => {
        try {
            await import('../models/index.model.js')
                .then(async () => await import('../seeders/index.seeder.js'));
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