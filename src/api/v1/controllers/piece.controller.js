const { redisService } = require("@v1/services/db/nosql.service");
const { Op } = require("@v1/services/db/sql.service");
const { getPieceBy } = require("@v1/services/piece.service");
const { swapPiecesToCoin } = require("@v1/services/user/user.service");
const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util");
const { getPayloadJWT, verifyJWT } = require("@v1/utils/token.util");
const { validateRequest } = require("@v1/validations/index.validation");
const { get } = redisService();

module.exports = {
    getPieceDetails: async (req, res) => {
        const messagesError = validateRequest({
            id: "required|number:(min:1)",
        }, req.params);

        if (messagesError.length > 0)
            return res.status(400).json(serviceResult({
                message: messagesError.join("OR"),
            }))

        const data = await getPieceBy({
            where: {
                [Op.AND]: [{ id: req.params.id }]
            }
        });

        return res.status(data.status === SERVICE_STATUS.ERROR ? 500 : 200).json(data)
    },

    swapPiecesToCoin: async (req, res) => {
        const messagesError = validateRequest({
            userId: "required|number",
            pieceId: "required|number",
            quantitySwap: "number"
        }, req.body)
        if (messagesError.length > 0)
            return res.status(400).json(serviceResult({
                message: messagesError.join("OR"),
            }))
        const data = await swapPiecesToCoin(req.body);
        return res.status(data.status === SERVICE_STATUS.SUCCESS ? 200 : 500).json(data)
    },
}