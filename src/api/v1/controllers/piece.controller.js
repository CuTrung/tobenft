const { register, login } = require("@v1/services/auth.service");
const { getPieceBy, getPieceBySingleCondition } = require("@v1/services/piece.service");
const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util");
const { validateRequest } = require("@v1/validations/index.validation");

module.exports = {
    getPieceDetails: async (req, res) => {
        const messagesError = validateRequest({
            pieceId: "required|number:(min:1)",
        }, req.params);

        if (messagesError.length > 0)
            return res.status(400).json(serviceResult({
                message: messagesError.join("OR"),
            }))

        const data = await getPieceBySingleCondition({
            condition: { id: req.params }
        });
        return res.status(data.status === SERVICE_STATUS.ERROR ? 500 : 200).json(data)
    },


}