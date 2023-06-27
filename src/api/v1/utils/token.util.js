const { hashSync, genSaltSync, compareSync } = require('bcryptjs');
const { TokenExpiredError, sign, verify } = require('jsonwebtoken');
const { formatDate } = require('./index.util');

const that = module.exports = {
    hashString: (str) => hashSync(str, genSaltSync(10)),
    compareHashString: (str, hashStr) => compareSync(str, hashStr),
    createJWT: (payload, expiresIn = '1d') => {
        let token;
        try {
            token = sign(payload, process.env.SECRET_KEY_JWT, { expiresIn });
        } catch (error) {
            console.log(error)
        }
        return token;
    },
    verifyJWT: (token) => {
        let decoded;
        try {
            const { iat, exp, ...data } = verify(token, process.env.SECRET_KEY_JWT);
            decoded = {
                ...data,
                createdAt: formatDate(new Date(iat * 1000)),
                expiredAt: formatDate(new Date(exp * 1000))
            };
        } catch (error) {
            console.log(error)
            if (error instanceof TokenExpiredError) {
                decoded = {
                    isExpired: true,
                    expiredAt: formatDate(new Date(error.expiredAt))
                }
            }
        }
        return decoded;
    },
    getPayloadJWT: (token) => {
        const payloadBase64 = that.decodeBase64(token);
        const start = payloadBase64.indexOf("}") + 1;
        const end = payloadBase64.indexOf("}", payloadBase64.indexOf("exp", start)) + 1;
        const { iat, exp, ...payload } = JSON.parse(payloadBase64.slice(start, end));
        return payload;
    },
    decodeBase64: (strBase64) => Buffer.from(strBase64, 'base64').toString('utf-8'),
    encodeBase64: (value) => Buffer.from(JSON.stringify(value), 'utf-8').toString('base64')
}

