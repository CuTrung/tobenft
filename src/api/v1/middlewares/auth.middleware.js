const { createAccessAndRefreshToken } = require("@v1/services/auth.service");
const { redisService } = require("@v1/services/db/nosql.service");
const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util");
const { verifyJWT, getPayloadJWT } = require("@v1/utils/token.util");

const nonSecureAuthPaths = ['/db/migrate', '/auth/login', '/auth/register'];
const that = module.exports = {
    checkJWT: async (req, res, next) => {
        if (nonSecureAuthPaths.includes(req.path))
            return next();

        const token = req.cookies.token || that.extractToken(req) || undefined
        if (token === undefined)
            return res.status(401).json(serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: `Unauthorized`
            }))

        const decoded = verifyJWT(token);

        if (decoded === undefined)
            return res.status(401).json(serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: `Unauthorized`
            }))

        req.user = decoded;
        next();
    },
    extractToken: (req) => {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
}