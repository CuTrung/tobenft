const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util");
const { compareHashString, createJWT, hashString } = require("@v1/utils/token.util");
const { getUserBy, createUser, } = require("./user.service");
const { Op } = require("./db/sql.service");
const { updatePieceBy, getPieceBy } = require("./piece.service");

module.exports = {
    register: async ({ name, email, password }) => {
        try {
            const { data: user, status } = await getUserBy({
                fields: ['id', 'name', 'password'],
                where: {
                    [Op.AND]: [{ email }]
                }
            });

            if (status === SERVICE_STATUS.ERROR) return serviceResult();

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
    login: async ({ email, password }) => {
        try {

            const { data: user, status } = await getUserBy({
                fields: ['id', 'name', 'password'],
                where: {
                    [Op.AND]: [{ email }]
                }
            });

            if (status === SERVICE_STATUS.ERROR) return serviceResult();

            const isCorrectPassword = user[0] && compareHashString(password.toString(), user[0].password);
            if (user[0] === undefined || !isCorrectPassword)
                return serviceResult({
                    status: SERVICE_STATUS.SUCCESS,
                    message: `Username or password isn't correct !`,
                })

            const { token: accessToken, publicKey: accessKey } = createJWT({
                userId: user[0].id,
                name: user[0].name,
                roles: []
            });

            const { token: refreshToken, publicKey: refreshKey } = createJWT({
                userId: user[0].id,
                name: user[0].name,
                roles: []
            }, '30d');
            // Lưu vào redis ?

            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: "Login success !",
                data: {
                    accessToken,
                    accessKey,
                    refreshToken,
                    refreshKey
                }
            });
        } catch (error) {
            console.log(">>> ~ file: auth.service.js:70 ~ login: ~ error: ", error)
            return serviceResult();
        }
    },
}

