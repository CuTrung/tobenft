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
            name: 'varchar(200)',
            address: 'varchar(100)',
            countryId: 'int(10)',
            cityId: 'int(10)',
            ownerId: 'int',
            latitude: 'varchar(50)',
            longitude: 'varchar(50)',
            description: 'varchar(1000)',
            email: 'varchar(200)',
            phone: 'varchar(11)',
            hoursOpen: 'varchar(100)',
            price: 'float',
            rating: 'float',
            placeId: 'int',
            imageId: 'varchar(100)',
            dateStart: 'varchar(100)',
            dateEnd: 'varchar(100)',
            linkWebsite: 'varchar(1000)',
            active: 'int(1) DEFAULT 1',
        },
        timestamp: true
    });

    await createTable('tb_Coin', {
        fields: {
            name: 'varchar(100)',
            type: 'varchar(100)',
            symbol: 'varchar(100)',
            price: 'float',
            platform: 'varchar(100)',
            imageId: 'int',
            fee_widthraw: 'float',
            active: 'int(2) DEFAULT 1'
        },
        timestamp: true
    });

    await createTable('tb_User_Piece', {
        fields: {
            quantity: 'int',
            userId: 'int',
            pieceId: 'int',
            active: 'int(1) DEFAULT 1'
        },
        timestamp: true
    });

    // Tại location đó có những piece nào
    await createTable('tb_LocationNFT_Piece', {
        fields: {
            amountPiece: 'int',
            amountPieceReality: 'int',
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
            active: 'int(2) DEFAULT 1'
        },
        timestamp: true
    });
}