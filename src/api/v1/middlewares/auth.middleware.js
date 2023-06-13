const { createAccessAndRefreshToken } = require("@v1/services/auth.service");
const { redisService } = require("@v1/services/db/nosql.service");
const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util");
const { verifyJWT, getPayloadJWT } = require("@v1/utils/token.util");
const { get } = redisService();

const nonSecureAuthPaths = ['/auth/login', '/auth/register'];
module.exports = {
    checkJWT: async (req, res, next) => {
        if (nonSecureAuthPaths.includes(req.path))
            return next();

        if (req.cookies.accessToken === undefined && req.cookies.refreshToken === undefined)
            return res.status(401).json(serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: `Unauthorized`
            }))

        const userId = getPayloadJWT(req.cookies.accessToken || req.cookies.refreshToken)?.userId;

        const decoded = verifyJWT(req.cookies.accessToken, await get(`access:${userId}`));

        if (decoded === undefined)
            return res.status(401).json(serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: `Unauthorized`
            }))
        if (decoded.isExpired) {
            const decodedRefresh = verifyJWT(req.cookies.refreshToken, await get(`refresh:${userId}`));
            if (decodedRefresh === undefined)
                return res.status(401).json(serviceResult({
                    status: SERVICE_STATUS.SUCCESS,
                    message: `Unauthorized`
                }))
            const { createdAt, expiredAt, ...payload } = decodedRefresh

            const { accessKey, accessToken, refreshKey, refreshToken } = createAccessAndRefreshToken(payload);

            const _1d = 1000 * 60 * 60 * 24;
            await set(`access:${userId}`, accessKey, _1d);
            await set(`refresh:${userId}`, refreshKey, _1d * 30);

            res.cookie('accessToken', accessToken, { maxAge: _1d });
            res.cookie('refreshToken', refreshToken, { maxAge: _1d * 30 });
        }

        // Check roles user

        next();
    }
}