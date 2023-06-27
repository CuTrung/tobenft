const { Op } = require('@v1/services/db/sql.service');
const { combinePieces, getUserBy } = require("@v1/services/user/user.service");
const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util");
const { validateRequest } = require("@v1/validations/index.validation");

module.exports = {
    combinePieces: async (req, res) => {
        const messagesError = validateRequest({
            itemId: "required|number:(min:1)",
        }, req.body);

        if (messagesError.length > 0)
            return res.status(400).json(serviceResult({
                message: messagesError.join("OR"),
            }))

        const data = await combinePieces({ ...req.body, userId: 1 ?? req.user.id });
        return res.status(data.status === SERVICE_STATUS.ERROR ? 500 : 200).json(data)
    },
}