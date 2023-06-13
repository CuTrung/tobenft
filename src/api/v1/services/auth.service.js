const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util");
const { compareHashString, createJWT, hashString } = require("@v1/utils/token.util");
const { getUserBy, createUser, } = require("./user/user.service");
const { Op } = require("./db/sql.service");
const { updatePieceBy, getPieceBy } = require("./piece.service");
const { redisService } = require("./db/nosql.service");
const { set, get } = redisService();

const that = module.exports = {
    register: async ({ name, email, password }) => {
        try {
            const { data: user } = await getUserBy({
                fields: ['id', 'name', 'password'],
                where: {
                    [Op.AND]: [{ email }]
                }
            });

            if (user === "") return serviceResult();

            if (user[0])
                return serviceResult({
                    status: SERVICE_STATUS.SUCCESS,
                    message: "Email already existed",
                });

            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: `Register success !`,
                data: await createUser({ name, email, password: hashString(password.toString()) }) ? { name } : ""
            })
        } catch (error) {
            console.log(">>> ~ file: auth.service.js:28 ~ register: ~ error: ", error)
            return serviceResult();
        }

    },
    createAccessAndRefreshToken: (payload) => {
        const { token: accessToken, publicKey: accessKey } = createJWT(payload);
        const { token: refreshToken, publicKey: refreshKey } = createJWT(payload, '30d');

        return { accessToken, accessKey, refreshToken, refreshKey };
    },
    login: async ({ email, password }) => {
        try {

            const { data: user, status } = await getUserBy({
                fields: ['id', 'name', 'password'],
                where: {
                    [Op.AND]: [{ email }]
                }
            });

            if (user === "") return serviceResult();

            const isCorrectPassword = user[0] && compareHashString(password.toString(), user[0].password);
            if (user[0] === undefined || !isCorrectPassword)
                return serviceResult({
                    status: SERVICE_STATUS.SUCCESS,
                    message: `Username or password isn't correct !`,
                })

            const { accessKey, accessToken, refreshKey, refreshToken } = that.createAccessAndRefreshToken({
                userId: user[0].id,
                name: user[0].name,
                roles: []
            })

            // Lưu vào redis 
            const _1d = 60 * 60 * 24;
            await set(`access:${user[0].id}`, accessKey, _1d);
            await set(`refresh:${user[0].id}`, refreshKey, _1d * 30);

            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: "Login success !",
                data: { accessToken, refreshToken }
            });
        } catch (error) {
            console.log(">>> ~ file: auth.service.js:70 ~ login: ~ error: ", error)
            return serviceResult();
        }
    },
}

