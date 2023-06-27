const { register, login } = require("@v1/services/auth.service");
const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util");
const { validateRequest } = require("@v1/validations/index.validation");

module.exports = {
    register: async (req, res) => {
        const messagesError = validateRequest({
            name: "required|string:(min:4)",
            email: "required|string:(min:5)",
            password: "required|string|number"
        }, req.body)
        if (messagesError.length > 0)
            return res.status(400).json(serviceResult({
                message: messagesError.join("OR"),
            }))

        const data = await register(req.body);
        return res.status(data.status === SERVICE_STATUS.ERROR ? 500 : 200).json(data)
    },
    login: async (req, res) => {
        const messagesError = validateRequest({
            email: "required|string:(min:5)",
            password: "required|string|number"
        }, req.body)
        if (messagesError.length > 0)
            return res.status(400).json(serviceResult({
                message: messagesError.join("OR"),
            }))
        const { data: token, message, status } = await login(req.body);

        const _1d = 1000 * 60 * 60 * 24;
        res.cookie('token', token, { maxAge: _1d * 30 });

        return res.status(status === SERVICE_STATUS.ERROR ? 500 : 200).json({ status, message })
    },

}