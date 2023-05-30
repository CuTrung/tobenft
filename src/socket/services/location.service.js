const { Op } = require("@v1/services/db/sql.service");
const { getLocationBy, updateLocation_Piece, getLocation_PieceBy } = require("@v1/services/location.service");
const { getPieceBy, updatePieceBy } = require("@v1/services/piece.service");
const { createUser_LocationNFTPiece } = require("@v1/services/user.service");
const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util");
const { calculateDistanceKm, toDateTimeMySQL } = require("@v1/utils/index.util");


const that = module.exports = {
    calculateDistance: async ({ userLng, userLat, locationId }) => {
        try {
            const { data: location, status } = await getLocationBy({
                fields: ['longitude', 'latitude'],
                where: {
                    [Op.AND]: [{ id: locationId }]
                }
            })

            if (status === SERVICE_STATUS.ERROR) return serviceResult()
            const distanceInMeters = calculateDistanceKm({
                lon1: location[0].longitude,
                lat1: location[0].latitude,
            }, {
                lon2: userLng,
                lat2: userLat,
            }) * 1000;
            const roundDistance = Math.round((distanceInMeters + Number.EPSILON) * 100) / 100;
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Calculate distance success',
                data: roundDistance
            });
        } catch (error) {
            console.log(">>> ~ file: location.service.js:33 ~ calculateDistance: ~ error: ", error)
            return serviceResult()
        }
    },
    pickupPiece: (socket) => {
        return async ({ body }, sendResult) => {
            try {
                const { locationId, pieceId, userLng, userLat } = body;

                const { data: locationPiece, status: statusLocationPiece } = await getLocation_PieceBy({
                    fields: ['amountPiece'],
                    where: {
                        [Op.AND]: [{ locationId, pieceId }]
                    }
                });

                if (statusLocationPiece === SERVICE_STATUS.ERROR)
                    return sendResult(serviceResult())

                if (locationPiece[0].amountPiece === 0) {
                    return sendResult(serviceResult({
                        status: SERVICE_STATUS.SUCCESS,
                        message: 'Piece is gone in here'
                    }))
                }

                const MIN_RADIUS_IN_METERS = 50;
                const { data: distanceInMeters, status: statusDistance } = await that.calculateDistance({
                    userLng,
                    userLat,
                    locationId
                });

                if (statusDistance === SERVICE_STATUS.ERROR)
                    return sendResult(serviceResult())

                if (distanceInMeters > MIN_RADIUS_IN_METERS) {
                    return sendResult(serviceResult({
                        status: SERVICE_STATUS.SUCCESS,
                        message: 'Distinct is invalid'
                    }))
                }

                // update amountPiece
                const { data: dataLocationPiece } = await updateLocation_Piece({
                    data: { amountPiece: locationPiece[0].amountPiece - 1 },
                    where: {
                        [Op.AND]: [{ id: locationPiece[0].id }]
                    }
                })

                // update quantityReality 
                const { data: piece, status: pieceStatus } = await getPieceBy({
                    fields: ['quantityReality'],
                    where: {
                        [Op.AND]: [{ id: pieceId }]
                    }
                })
                if (pieceStatus === SERVICE_STATUS.ERROR)
                    return sendResult(serviceResult())

                const { data: dataPieceUpdate, status: pieceStatusUpdate } = await updatePieceBy({
                    data: { quantityReality: piece[0].quantityPiece - 1 },
                    where: {
                        [Op.AND]: [{ id: pieceId }]
                    }
                })

                if (pieceStatusUpdate === SERVICE_STATUS.ERROR)
                    return sendResult(serviceResult())


                // Insert tb_User_LocationNFTPiece
                // userId decode from token
                const { data: dataUserLocation, status: userLocationNFTPieceStatus } = await createUser_LocationNFTPiece({
                    totalPieceReceived: 1,
                    userId: 1,
                    locationNFTPieceId: dataLocationPiece[0].id,
                    time: toDateTimeMySQL(new Date())
                })

                if (userLocationNFTPieceStatus === SERVICE_STATUS.ERROR)
                    return sendResult(serviceResult())

                sendResult(serviceResult({
                    status: SERVICE_STATUS.SUCCESS,
                    message: 'Pickup piece success',
                    data: piece[0],
                }))
            } catch (error) {
                console.log(">>> ~ file: location.service.js:113 ~ return ~ error: ", error)
                return sendResult(serviceResult())
            }
        }
    }
}