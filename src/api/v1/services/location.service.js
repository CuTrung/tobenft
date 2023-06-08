const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util");
const { mysqlService, Op } = require("./db/sql.service");
const { getItemBy } = require("./item.service");
const { calculateDistanceKm } = require("@v1/utils/index.util");
const { select, update } = mysqlService();

const that = module.exports = {
    getLocationBy: async ({ fields, where: condition }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Get location success',
                data: await select('tb_locationnft', { fields, where: condition })
            })
        } catch (error) {
            console.log(">>> ~ file: location.service.js:14 ~ getLocationBy: ~ error: ", error)
            return serviceResult();
        }
    },
    getLocation_PieceBy: async ({ fields, where: condition }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Get location_piece success',
                data: await select('tb_Locationnft_Piece', { fields, where: condition })
            })
        } catch (error) {
            console.log(">>> ~ file: location.service.js:26 ~ getLocation_PieceBy: ~ error: ", error)
            return serviceResult();
        }
    },
    updateLocation_Piece: async ({ data, where: condition, connection }) => {
        try {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Update location_Piece success',
                data: await update("tb_Locationnft_Piece", {
                    data,
                    connection,
                    where: condition
                })
            })
        } catch (error) {
            console.log(">>> ~ file: location.service.js:51 ~ updateLocation_Piece: ~ error: ", error)
            return serviceResult();
        }
    },
    getAllLocation: async ({ userLat, userLng, kilometers = 5 } = {}) => {
        try {
            // Về sau check thêm điều kiện item đó còn thời hạn không (timeEnd)
            const dataSelect = await select('tb_locationnft l', {
                fields: ['l.id', 'l.address', 'l.latitude', 'l.longitude', 'p.id as `pieceId`', 'p.itemId', 'p.quantityReality', 'i.splitTo', 'i.amountOfCoins'],
                queryAtTheEnd: 'INNER JOIN tb_locationnft_piece lp ON lp.locationId = l.id INNER JOIN tb_Piece p ON lp.pieceId = p.id INNER JOIN tb_item i ON i.id = p.itemId',
            });

            const data = [];
            for (let item of dataSelect) {
                const distance = calculateDistanceKm({
                    lat1: userLat,
                    lon1: userLng
                }, {
                    lat2: item.latitude,
                    lon2: item.longitude
                });

                if (distance >= kilometers) continue;

                item = {
                    id: item.id,
                    address: item.address,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    pieces: [{
                        id: item.pieceId,
                        quantityReality: item.quantityReality,
                        amountOfCoins: item.amountOfCoins / item.splitTo,
                        itemId: item.itemId,
                    }],
                }

                let match = data.find(r => r.id === item.id);
                if (match) {
                    match.pieces = match.pieces.concat(item.pieces);
                } else {
                    data.push(item);
                }
            }

            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: "Get all location success",
                data
            })
        }
        catch (error) {
            console.log(">>> ~ file: location.service ~ location: ~ error: ", error);
            return serviceResult();
        }
    },
}