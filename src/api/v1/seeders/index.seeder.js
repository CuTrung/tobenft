const { mysqlService } = require("../services/db/sql.service");
const { addDays, formatDate } = require("../utils/index.util");
const { insert } = mysqlService();

module.exports = async () => {
    await insert('tb_Item', {
        data: [
            {
                name: 'IPhone 11',
                timeStart: formatDate(new Date()),
                timeEnd: addDays(new Date(), 5),
                quantity: 5,
                splitTo: 4,
                amountOfCoins: 4,
                quantityReality: 5,
            },
            {
                name: 'Chảo',
                timeStart: formatDate(new Date()),
                timeEnd: addDays(new Date(), 2),
                quantity: 3,
                splitTo: 3,
                amountOfCoins: 3,
                quantityReality: 3,
            },
        ]
    })



    await insert('tb_Piece', {
        data: [
            {
                itemId: 1,
                quantity: 10,
                quantityReality: 9,
            },
            {
                itemId: 1,
                quantity: 6,
                quantityReality: 6,
            },
            {
                itemId: 2,
                quantity: 8,
                quantityReality: 8,
            },
        ]
    });

    await insert('tb_LocationNFT_Piece', {
        data: [
            {
                amountPiece: 5,
                locationId: 1,
                pieceId: 1
            },
            {
                amountPiece: 3,
                locationId: 1,
                pieceId: 2
            },
            {
                amountPiece: 3,
                locationId: 2,
                pieceId: 2
            },
        ]
    });

    await insert('tb_User', {
        data: [
            {
                name: 'user1',
                email: 'user1@gmail.com',
                password: '123456',
                phone: '111111',
            },
            {
                name: 'user2',
                email: 'user2@gmail.com',
                password: '123456',
            },
        ]
    });

    await insert('tb_LocationNFT', {
        data: [
            {
                address: '64 Trường Chinh, Phường 4, Tân Bình, Thành phố Hồ Chí Minh, Việt Nam',
                latitude: '10.793686270914913',
                longitude: '106.65231156966536',
            },
            {
                address: '294 Khuông Việt, Phú Trung, Tân Phú, Thành phố Hồ Chí Minh',
                latitude: '10.772753449633006',
                longitude: '106.6373752658733',
            },
        ]
    });

    await insert('tb_Coin', {
        data: [
            {
                name: 'Tobe',
                price: 0.1
            },
            {
                name: 'USDT',
                price: 0.3
            },
        ]
    })

    await insert('tb_User_Piece', {
        data: [
            {
                quantity: 1,
                userId: 1,
                pieceId: 1
            },
            {
                quantity: 1,
                userId: 1,
                pieceId: 2
            },
            {
                quantity: 1,
                userId: 2,
                pieceId: 1
            },
        ],

    })

    await insert('tb_User_LocationNFTPiece', {
        data: [
            {
                quantityPiece: 1,
                time: formatDate(new Date()),
                userId: 1,
                locationNFTPieceId: 1
            },
            {
                quantityPiece: 2,
                locationNFTPieceId: 2,
                time: formatDate(new Date()),
                userId: 1,
            },
            {
                quantityPiece: 1,
                time: formatDate(new Date()),
                userId: 2,
                locationNFTPieceId: 2
            },
        ]
    });

    await insert('tb_User_Item', {
        data: [
            {
                time: formatDate(new Date()),
                userId: 1,
                itemId: 1,
                quantityItem: 1,
            },
            {
                time: formatDate(new Date()),
                userId: 1,
                itemId: 2,
                quantityItem: 1,
            },
            {
                time: formatDate(new Date()),
                userId: 2,
                itemId: 2,
                quantityItem: 1,
            },
        ]
    });
}
