const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util");
const { mysqlService, Op } = require("./db/sql.service");
const { getItemBy } = require("./item.service");
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
            const dataKilo = [];
            await getItemBy({
                fields: ['amountOfCoins', 'splitTo']

            })
            const dataSelect = await select('tb_locationnft l', {
                fields: ['l.id', 'l.address', 'l.latitude', 'l.longitude', 'p.id', 'p.itemId', 'p.quantityReality',],
                queryAtTheEnd: 'INNER JOIN tb_locationnft_piece lp ON lp.locationId = l.id INNER JOIN tb_Piece p ON lp.pieceId = p.id',
            });


            console.log(">>> here", dataSelect);
            return;
            const data = Promise.all(dataSelect.map(async (item) => {
                const distance = calculateDistanceKm({
                    lat1: userLat,
                    lon1: userLng
                }, {
                    lat2: item.latitude,
                    lon2: item.longitude
                });

                const { data: dataItem } = await getItemBy({
                    fields: ['splitTo', 'amountOfCoins'],
                    where: {
                        [Op.AND]: [
                            { id: item.itemId }
                        ]
                    }
                })

                if (distance <= kilometers) {
                    console.log(distance);
                    dataKilo.push(item);
                }
            }));

            // Gom nhóm các piece
            const combinedArray = Object.values(dataKilo.reduce((acc, obj) => {
                const { locationnftId, address, latitude, longitude, ...rest } = obj;
                if (!acc[locationnftId]) {
                    acc[locationnftId] = { locationnftId, address, latitude, longitude, piece: [] };
                }
                acc[locationnftId].piece.push({
                    pieceId: obj.pieceId,
                    totalPiece: obj.totalPiece,
                    totalPieceReality: obj.totalPieceReality,
                    src: obj.src,
                    priceCoin: obj.priceCoin
                });
                return acc
            }, {}));
            console.log(combinedArray);

            return resFormat({
                status: RES_STATUS.SUCCESS,
                message: "All data of locationNFT",
                data: combinedArray
            })
        }
        catch (error) {
            console.log(">>> ~ file: location.service ~ location: ~ error: ", error);
            return resFormat()
        }
    },
}