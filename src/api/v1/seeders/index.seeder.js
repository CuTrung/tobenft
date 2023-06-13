const { mysqlService } = require("../services/db/sql.service");
const { addDays, formatDate } = require("../utils/index.util");
const { insert } = mysqlService();

module.exports = async () => {
    await insert('tb_item', {
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

    await insert('tb_piece', {
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
                amountPieceReality: 5,
                locationId: 1,
                pieceId: 1
            },
            {
                amountPiece: 3,
                amountPieceReality: 3,
                locationId: 1,
                pieceId: 2
            },
            {
                amountPiece: 3,
                amountPieceReality: 3,
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
                name: "Moon Fast Food - Món Hàn - Xuân Hồng",
                address: '53 Xuân Hồng, P. 12,  Quận Tân Bình, TP. HCM',
                ownerId: 1,
                latitude: '10.793686270914913',
                longitude: '106.65231156966536',
                description: "Hôm bữa Hân có dịp ghé đây, lên search google các quán ăn hàn quốc là có Moon trong danh sách nên đi thử ",
                email: "Moonfastfoodmonhanxuanhong@gmail.com",
                phone: "1565525412",
                price: 300,
                rating: 4.6,
                placeId: 1,
            },
            {
                name: "Highlands Coffee",
                address: '370 Tan Son Nhi, street, Tân Phú, Thành phố Hồ Chí Minh, Vietnam"',
                ownerId: 2,
                latitude: '10.795681705856847',
                longitude: '106.62968105481563',
                price: 300,
                rating: 4.8,
                placeId: 2,
            },
            {
                name: "Hanuri - Quán Ăn Hàn Quốc - Xô Viết Nghệ Tĩnh",
                address: '121 Xô Viết Nghệ Tĩnh, P. 17,  Quận Bình Thạnh, TP. HCM',
                ownerId: 3,
                latitude: '10.76866626247971',
                longitude: '106.61759730052135',
                description: "Nằm trên mặt tiền đường Xô Viết Nghệ Tĩnh, quán có chỗ để xe rộng rãi.",
                email: "hanurixovietnghetinh@gmail.com",
                phone: "1668558956",
                price: 250,
                rating: 4.6,
                placeId: 1,
            },
            {
                name: "Thềm Xưa Cafe - Nguyễn Cảnh Chân",
                address: '371D1 Nguyễn Cảnh Chân, P. Nguyễn Cư Trinh,  Quận 1, TP. HCM',
                ownerId: 3,
                latitude: '10.7602704',
                longitude: '106.6832034',
                description: "Quán thiết kế khá, không rộng rãi lắm ( do kê khá nhiều bàn ghế, diện tích lớn",
                email: "themxuacafe@gmail.com",
                phone: "90002314523",
                price: 300,
                rating: 5.0,
                placeId: 1,
            },
        ]
    });

    await insert('tb_Coin', {
        data: [
            {
                name: 'TobeCoin',
                symbol: 'TBC',
                price: 0.1,
                type: "PAYMENT",
                fee_widthraw: 0.2,
            },
            {
                name: 'USDT',
                symbol: "US Dollar",
                price: 0.3,
                type: "PAYMENT",
                fee_widthraw: 0.1,
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