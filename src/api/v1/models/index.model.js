const { mysqlService } = require("@v1/services/db/sql.service")
const { createTable } = mysqlService();

createTable('tb_Item', {
    name: 'varchar(255)',
    timeStart: 'varchar(100)',
    timeEnd: 'varchar(100)',
    active: 'int(1) DEFAULT 1',
    quantity: 'int',
    quantityPiece: 'int',
    quantityReality: 'int',
    src: 'varchar(255)',
}, { timestamp: true });

createTable('tb_Piece', {
    itemId: 'int',
    src: 'varchar(255)',
    priceCoin: 'float',
    quantity: 'int',
    quantityReality: 'int',
}, { timestamp: true });

createTable('tb_LocationNFT_Piece', {
    amountPiece: 'int',
    locationId: 'int',
    pieceId: 'int'
}, { timestamp: true });

createTable('tb_User', {
    name: 'varchar(100)',
    email: 'varchar(50)',
    password: 'varchar(255)',
    phone: 'varchar(15)',
    active: 'int(1) DEFAULT 1',
}, { timestamp: true });

createTable('tb_LocationNFT', {
    address: 'varchar(100)',
    latitude: 'varchar(50)',
    longitude: 'varchar(50)',
    active: 'int(1) DEFAULT 1',
}, { timestamp: true });

createTable('tb_Coin', {
    name: 'varchar(100)',
    price: 'float',
}, { timestamp: true });

createTable('tb_User_LocationNFTPiece', {
    totalPieceReceived: 'varchar(255)',
    time: 'varchar(100)',
    userId: 'int',
    locationNFTPieceId: 'int',
}, { timestamp: true });

createTable('tb_TrackingReceiveItem', {
    time: 'varchar(100)',
    userId: 'int',
    itemId: 'int',
}, { timestamp: true });

createTable('tb_TrackingSwapToCoin', {
    time: 'varchar(100)',
    userId: 'int',
    pieceId: 'int',
    coinId: 'int',
}, { timestamp: true });