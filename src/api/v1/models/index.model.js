const { mysqlService } = require("@v1/services/db/sql.service")
const { createTable } = mysqlService();

module.exports = async () => {
    await createTable('tb_Item', {
        fields: {
            name: 'varchar(255)',
            timeStart: 'varchar(100)',
            timeEnd: 'varchar(100)',
            active: 'int(1) DEFAULT 1',
            src: 'varchar(255)',
            splitTo: 'int', // cắt thành n piece
            amountOfCoins: 'int', // default: tobe coin
            quantity: 'int',
            quantityReality: 'int',
        },
        timestamp: true
    });

    await createTable('tb_Piece', {
        fields: {
            itemId: 'int',
            src: 'varchar(255)',
            // quantityCoin: 3,
            quantity: 'int',
            quantityReality: 'int',
        },
        timestamp: true
    });



    await createTable('tb_User', {
        fields: {
            name: 'varchar(100)',
            email: 'varchar(50)',
            password: 'varchar(255)',
            phone: 'varchar(15)',
            active: 'int(1) DEFAULT 1',
        },
        timestamp: true
    });

    await createTable('tb_LocationNFT', {
        fields: {
            address: 'varchar(100)',
            latitude: 'varchar(50)',
            longitude: 'varchar(50)',
            active: 'int(1) DEFAULT 1',
        },
        timestamp: true
    });

    await createTable('tb_Coin', {
        fields: {
            name: 'varchar(100)',
            price: 'float',
        },
        timestamp: true
    });

    await createTable('tb_User_Piece', {
        fields: {
            quantity: 'int',
            userId: 'int',
            pieceId: 'int',
        },
        timestamp: true
    });

    // Tại location đó có những piece nào
    await createTable('tb_LocationNFT_Piece', {
        fields: {
            amountPiece: 'int',
            locationId: 'int',
            pieceId: 'int'
        },
        timestamp: true
    });

    // User nhặt piece nào, số lượng bao nhiêu, piece đó ở location nào.
    await createTable('tb_User_LocationNFTPiece', {
        fields: {
            quantityPiece: 'int',
            time: 'varchar(100)',
            userId: 'int',
            locationNFTPieceId: 'int',
        },
        timestamp: true
    });

    await createTable('tb_User_Item', {
        fields: {
            time: 'varchar(100)',
            userId: 'int',
            itemId: 'int',
            quantityItem: 'int',
        },
        timestamp: true
    });


    await createTable('tb_TrackingUser_Piece', {
        fields: {
            quantityChanging: 'int',
            time: 'varchar(100)',
            userId: 'int',
            pieceId: 'int',
        },
        timestamp: true
    });
}
