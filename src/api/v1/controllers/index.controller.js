const { runMigrate } = require("@v1/services/index.service")
const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util")
const { validateRequest } = require("@v1/validations/index.validation")

module.exports = {
    runMigrate: async (req, res) => {
        return res.status(200).json(await runMigrate())
    },

}