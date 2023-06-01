const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util")
const { mysqlService, Op } = require("./db/sql.service")
const { getPieceBy } = require("./piece.service")
const { toDateTimeMySQL } = require("@v1/utils/index.util")
const { updateItemBy, getItemBy } = require("./item.service")

const { select, insert, transaction, update, _delete } = mysqlService()

const that = module.exports = {
    getUserBy: async ({ fields, where: condition }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Get user success',
                data: await select('tb_user', { fields, where: condition })
            })
        } catch (error) {
            console.log(">>> ~ file: user.service.js:15 ~ getUserBy: ~ error: ", error)
            return serviceResult();
        }
    },
    createUser: async ({ name, email, password }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Create user success',
                data: await insert('tb_user', {
                    fields: { name, email, password },
                })
            })
        } catch (error) {
            console.log(">>> ~ file: user.service.js:28 ~ createUser: ~ error: ", error)
            return serviceResult();
        }
    },
    getUser_LocationNFTPieceBy: async ({ fields, where: condition }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Get User_LocationNFTPiece success',
                data: await select('tb_User_LocationNFTPiece', { fields, where: condition })
            })
        } catch (error) {
            console.log(">>> ~ file: user.service.js:42 ~ getUser_LocationNFTPieceBy: ~ error: ", error)

            return serviceResult();
        }
    },
    updateUser_LocationNFTPiece: async ({ data, where: condition, connection }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Update User_LocationNFTPiece success',
                data: await update("tb_User_LocationNFTPiece", {
                    data,
                    where: condition,
                    connection
                })
            })
        } catch (error) {
            console.log(">>> ~ file: user.service.js:46 ~ updateUser_LocationNFTPiece: ~ error: ", error)

            return serviceResult();
        }
    },
    createUser_LocationNFTPiece: async ({
        totalPieceReceived,
        time,
        userId,
        locationNFTPieceId,
        connection
    }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Created User_LocationNFTPiece success',
                data: await insert('tb_User_LocationNFTPiece', {
                    data: [
                        {
                            totalPieceReceived,
                            time,
                            userId,
                            locationNFTPieceId,
                        }
                    ],
                    connection
                })
            });
        } catch (error) {
            console.log(">>> ~ file: user.service.js:45 ~ error: ", error)
            return serviceResult();
        }

    },
    getUser_LocationNFTPieceBy: async ({ fields, where: condition, joins, connection }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Get User_LocationNFTPiece success',
                data: await select('tb_User_LocationNFTPiece', { fields, where: condition, joins, connection })
            })
        } catch (error) {
            console.log(">>> ~ file: user.service.js:71 ~ getUser_LocationNFTPieceBy ~ error: ", error)
            return serviceResult();
        }
    },
    checkCombine: async ({ userId, itemId, connection }) => {
        const { data: pieces } = await getPieceBy({
            fields: ['id'],
            where: {
                [Op.AND]: [{ itemId }]
            },
            connection
        })

        if (pieces === "") return serviceResult();

        const { data: dataUserPiece } = await that.getUser_LocationNFTPieceBy({
            fields: ['lp.pieceId'],
            where: {
                [Op.AND]: [{ userId }]
            },
            joins: [
                {
                    table: "tb_LocationNFT_Piece lp"
                }
            ],
            connection
        })

        if (dataUserPiece === "") return serviceResult()

        const pieceIds = pieces.map(item => item.id);
        return {
            isValid: dataUserPiece.filter(data => pieceIds.includes(data.pieceId)).length === pieces.length,
            user_pieceIds: pieceIds.map(pieceId => ({ userId, pieceId }))
        }
    },
    combinePieces: async ({ userId, itemId, connection }) => {
        const { isValid, user_pieceIds } = that.checkCombine({ userId, itemId, connection })
        if (!isValid)
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: "You don't have enough pieces"
            })

        const data = await transaction(async (connection) => {
            for (const user_pieceId of user_pieceIds) {
                const { data: userPiece } = await that.getUser_PieceBy({
                    fields: ['quantity'],
                    where: {
                        [Op.AND]: [user_pieceId]
                    },
                    connection
                })

                if (userPiece[0] === "") return serviceResult();


                // Delete nếu quantity === 1
                if (userPiece[0].quantity === 1) {
                    const { data: dataUser_PieceDel } = await that.deleteUser_PieceBy({
                        where: {
                            [Op.AND]: [user_pieceId]
                        },
                        connection
                    })
                    if (dataUser_PieceDel === "") return serviceResult();
                } else {
                    const { data: dataUpdateUserPiece } = await that.updateUser_Piece({
                        data: {
                            quantity: userPiece[0].quantity - 1
                        },
                        where: {
                            [Op.AND]: [user_pieceId]
                        },
                        connection
                    })
                    if (dataUpdateUserPiece === "") return serviceResult();
                }


            }

            const { data: item } = await getItemBy({
                fields: ['quantityReality'],
                where: {
                    [Op.AND]: [{ id: itemId }]
                }
            })

            if (item === "") return serviceResult();

            const { data: itemUpdate } = await updateItemBy({
                data: {
                    quantityReality: item.quantityReality - 1
                },
                where: {
                    [Op.AND]: [{ id: itemId }]
                },
                connection
            })

            if (itemUpdate === "") return serviceResult();

            const { data: userItem } = await that.createUser_Item({
                userId,
                itemId,
                time: toDateTimeMySQL(new Date()),
                quantityItem: 1,
                connection
            })

            return item;
        })

        if (data === "") return serviceResult();

        return serviceResult({
            status: SERVICE_STATUS.SUCCESS,
            message: 'Combine pieces success',
            data
        })
    },

    // { userId, itemId }
    createUser_Item: async ({ userId, itemId, time, quantityItem, connection }) => {
        return serviceResult({
            status: SERVICE_STATUS.SUCCESS,
            message: 'Created user_item success',
            data: await insert('tb_User_Item', {
                data: [{ userId, itemId, time, quantityItem }],
                connection,
            })
        })
    },
    getUser_PieceBy: async ({ fields, where: condition, joins, connection }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Get User_Piece success',
                data: await select('tb_User_Piece', { fields, where: condition, joins, connection })
            })
        } catch (error) {
            console.log(">>> ~ file: user.service.js:223 ~ getUser_PieceBy: ~ error: ", error)

            return serviceResult();
        }
    },
    updateUser_Piece: async ({ data, where: condition, connection }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Update User_Piece success',
                data: await update("tb_User_Piece", {
                    data,
                    where: condition,
                    connection
                })
            })
        } catch (error) {
            console.log(">>> ~ file: user.service.js:240 ~ updateUser_Piece: ~ error: ", error)

            return serviceResult();
        }
    },
    createUser_Piece: async ({ userId, pieceId, connection }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Created user_piece success',
                data: await insert('tb_User_Piece', {
                    data: [{ userId, pieceId }],
                    connection,
                })
            })
        } catch (error) {
            console.log(">>> ~ file: user.service.js:256 ~ createUser_Piece: ~ error: ", error)
            return serviceResult()
        }
    },
    deleteUser_PieceBy: async ({ where: condition, connection }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Get User_Piece success',
                data: await _delete('tb_User_Piece', { where: condition, connection })
            })
        } catch (error) {
            console.log(">>> ~ file: user.service.js:262 ~ getUser_PieceBy: ~ error: ", error)
            return serviceResult();
        }
    },
}