const { mysqlService } = require("../services/db/sql.service");
const { addDays, formatDate } = require("../utils/index.util");

const { bulkInsert } = mysqlService();

// Khi dùng bulkInsert mà data ko đồng nhất thì đang lỗi
bulkInsert('tb_Item', [
    {
        name: 'IPhone 11',
        timeStart: formatDate(new Date()),
        timeEnd: addDays(new Date(), 5),
        quantity: 5,
        quantityPiece: 4,
        quantityReality: 5,
    },
    {
        name: 'Chảo',
        timeStart: formatDate(new Date()),
        timeEnd: addDays(new Date(), 2),
        quantity: 3,
        quantityPiece: 3,
        quantityReality: 3,
    },
])



bulkInsert('tb_Piece', [
    {
        itemId: 1,
        priceCoin: 1,
        quantity: 10,
        quantityReality: 9,
    },
    {
        itemId: 2,
        priceCoin: 0.5,
        quantity: 8,
        quantityReality: 8,
    },
]);

bulkInsert('tb_LocationNFT_Piece', [
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
]);

bulkInsert('tb_User', [
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
]);

bulkInsert('tb_LocationNFT', [
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
]);

bulkInsert('tb_Coin', [
    {
        name: 'Tobe',
        price: 0.1
    },
    {
        name: 'USDT',
        price: 0.3
    },
])

bulkInsert('tb_User_LocationNFTPiece', [
    {
        totalPieceReceived: 1,
        time: formatDate(new Date()),
        userId: 1,
        locationNFTPieceId: 1
    },
    {
        totalPieceReceived: 2,
        locationNFTPieceId: 2,
        time: formatDate(new Date()),
        userId: 1,
    },
    {
        totalPieceReceived: 1,
        time: formatDate(new Date()),
        userId: 2,
        locationNFTPieceId: 2
    },
]);

bulkInsert('tb_TrackingReceiveItem', [
    {
        timeReceive: formatDate(new Date()),
        userId: 1,
        itemId: 1,
    },
    {
        timeReceive: formatDate(new Date()),
        userId: 1,
        itemId: 2,
    },
    {
        timeReceive: formatDate(new Date()),
        userId: 2,
        itemId: 2,
    },
]);

bulkInsert('tb_TrackingSwapToCoin', [
    {
        time: formatDate(new Date()),
        userId: 1,
        pieceId: 1,
        coinId: 1,
    },
    {
        time: formatDate(new Date()),
        userId: 1,
        pieceId: 1,
        coinId: 2,
    },
    {
        time: formatDate(new Date()),
        userId: 2,
        pieceId: 2,
        coinId: 2,
    },
]);

