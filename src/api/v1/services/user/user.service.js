const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util")
const { mysqlService, Op } = require("../db/sql.service")
const { getPieceBy } = require("../piece.service")
const { toDateTimeMySQL } = require("@v1/utils/index.util")
const { updateItemBy, getItemBy } = require("../item.service")
const { getUser_PieceBy, updateUser_Piece, deleteUser_PieceBy, createTrackingUser_Piece } = require("./user_Piece.service")
const { pickupPiece } = require("@src/socket/services/location.service")
const { createUser_Item } = require("./user_Item.service")

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
                    data: [{ name, email, password }],
                })
            })
        } catch (error) {
            console.log(">>> ~ file: user.service.js:28 ~ createUser: ~ error: ", error)
            return serviceResult();
        }
    },
    combinePieces: async ({ userId, itemId, connection }) => {
        const { data: pieceOfItem } = await getPieceBy({
            fields: ['id'],
            where: {
                [Op.AND]: [{ itemId }]
            },
            connection
        })

        if (pieceOfItem === "") return serviceResult();

        const { data: pieceOfUser } = await getUser_PieceBy({
            fields: ['userId', 'pieceId', 'quantity'],
            where: {
                [Op.AND]: pieceOfItem.map(piece => ({ userId, pieceId: piece.id }))
            },
            connection
        })

        if (pieceOfUser === "") return serviceResult()

        if (pieceOfUser.length !== pieceOfItem.length)
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: "You don't have enough pieces"
            })

        const data = await transaction(async (connection) => {
            for (const userPiece of pieceOfUser) {
                if (userPiece.quantity === 1) {
                    const { data: dataUser_PieceDel } = await that.deleteUser_PieceBy({
                        where: {
                            [Op.AND]: [
                                {
                                    userId: userPiece.userId,
                                    pieceId: userPiece.pieceId
                                }
                            ]
                        },
                        connection
                    })
                    if (dataUser_PieceDel === "") return serviceResult();
                } else {
                    const { data: dataUpdateUserPiece } = await updateUser_Piece({
                        data: {
                            quantity: userPiece.quantity - 1
                        },
                        where: {
                            [Op.AND]: [
                                {
                                    userId: userPiece.userId,
                                    pieceId: userPiece.pieceId
                                }
                            ]
                        },
                        connection
                    })
                    if (dataUpdateUserPiece === "") return serviceResult();
                }

                const { data: dataTrackingUser_Piece } = await createTrackingUser_Piece({
                    userId: userPiece.userId,
                    pieceId: userPiece.pieceId,
                    time: toDateTimeMySQL(new Date()),
                    quantityChanging: -1
                })

                if (dataTrackingUser_Piece === "") return serviceResult();
            }

            const { data: item } = await getItemBy({
                fields: ['quantityReality'],
                where: {
                    [Op.AND]: [{ id: itemId }]
                },
                connection
            })

            if (item === "") return serviceResult();

            const { data: itemUpdate } = await updateItemBy({
                data: {
                    quantityReality: item[0].quantityReality - 1
                },
                where: {
                    [Op.AND]: [{ id: itemId }]
                },
                connection
            })

            if (itemUpdate === "") return serviceResult();

            const { data: userItem } = await createUser_Item({
                userId,
                itemId,
                time: toDateTimeMySQL(new Date()),
                quantityItem: 1,
                connection
            })

            if (userItem === "") return serviceResult();

            return item;
        })

        if (data === "") return serviceResult();

        return serviceResult({
            status: SERVICE_STATUS.SUCCESS,
            message: 'Combine pieces success',
            data
        })
    },
    swapPiecesToCoin: async ({ userId, pieceId, quantitySwap = 1 }) => {
        try {
            const data = await transaction(async (connection) => {
                const { data: userPiece } = await getUser_PieceBy({
                    fields: ['id', 'quantity'],
                    where: {
                        [Op.AND]: [{ userId, pieceId }]
                    },
                    connection,
                })

                if (userPiece === "") return serviceResult();

                if (userPiece.length < 0)
                    return resFormat({
                        status: SERVICE_STATUS.SUCCESS,
                        message: "Piece is not enough"
                    })

                let dataUpdated;
                if (userPiece[0].quantity === 1 && userPiece[0].quantity >= quantitySwap) {
                    const { data: dataDeleteUserPiece } = await deleteUser_PieceBy({
                        where: {
                            [Op.AND]: [{ userId, pieceId }]
                        },
                        connection
                    })
                    if (dataDeleteUserPiece === "")
                        return serviceResult()
                    dataUpdated = dataDeleteUserPiece
                } else {
                    const { data: dataUpdateUserPiece } = await updateUser_Piece({
                        data: {
                            quantity: userPiece[0].quantity - quantitySwap
                        },
                        where: {
                            [Op.AND]: [
                                { userId, pieceId }
                            ]
                        },
                        connection
                    })

                    if (dataUpdateUserPiece === "") return serviceResult()

                    dataUpdated = dataUpdateUserPiece
                }

                // Cập nhật số dư wallet người dùng (tăng tiền)
                // ...


                // Tạo lịch sử
                const { data: dataTrackingUser_Piece } = await createTrackingUser_Piece({
                    userId: userPiece.userId,
                    pieceId: userPiece.pieceId,
                    time: toDateTimeMySQL(new Date()),
                    quantityChanging: -quantitySwap,
                    connection
                })

                if (dataTrackingUser_Piece === "") return serviceResult();

                return dataUpdated;
            })

            if (data === "") return serviceResult();

            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Swap pieces success',
                data
            })
        } catch (error) {
            console.log(">>> ~ file: user.service.js:226 ~ swapPiecesToCoin: ~ error: ", error)

            return resFormat({})
        }
    },
}