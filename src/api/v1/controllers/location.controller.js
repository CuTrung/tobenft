const { register, login } = require("@v1/services/auth.service");
const { Op } = require("@v1/services/db/sql.service");
const { getAllLocation } = require("@v1/services/location.service");
const { getPieceBy } = require("@v1/services/piece.service");
const { swapPiecesToCoin } = require("@v1/services/user/user.service");
const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util");
const { validateRequest } = require("@v1/validations/index.validation");


module.exports = {
    getAllLocation: async (req, res) => {
        const messagesError = validateRequest({
            // km: "number",
            // userLat: 'number',
            // userLng: 'number',
        }, req.query);

        if (messagesError.length > 0)
            return res.status(400).json(serviceResult({
                message: messagesError.join("OR"),
            }))

        const { status } = await getAllLocation(req.query);
        return res.status(status === SERVICE_STATUS.ERROR ? 500 : 200).json(data)
    },


}