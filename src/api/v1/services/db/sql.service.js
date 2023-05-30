const { db } = require("@src/configs/db.config");
const TYPE_JOIN = {
    INNER_JOIN: 'INNER JOIN',
    LEFT_JOIN: 'LEFT JOIN',
    RIGHT_JOIN: 'RIGHT JOIN',
    CROSS_JOIN: 'CROSS JOIN',
}
const Op = {
    AND: 'AND',
    OR: 'OR'
}
const that = module.exports = {
    TYPE_JOIN,
    Op,
    mysqlService: () => {
        const execQuery = async ({ query, data = "", connection }) => {
            let dataExec = [];
            // Ko bắt try catch để được chạy vào try catch của transaction
            if (connection) {
                console.log(`${query} |||||| ${data}`);
                dataExec = await (connection ?? db.mySQL).query(query, data);
                return dataExec;
            }

            try {
                console.log(`${query} |||||| ${data}`);
                dataExec = await db.mySQL.query(query, data);
            } catch (error) {
                console.log(">>> ~ file: sql.service.js:9 ~ execQuery ~ error: ", error)
            }
            return dataExec;
        }

        // Khi có timestamp sẽ tự động tạo 2 cột createdAt and updatedAt
        const createTable = async (tableName, fields, { timestamp } = {}) => {
            const isStringMySQL = (value) => {
                const DATA_TYPE_STRING_MYSQL = ['VARCHAR', 'TEXT'];
                return DATA_TYPE_STRING_MYSQL.includes(value.split('(')[0].replace(" ", "").toUpperCase());
            }

            const columns = [];
            for (const [key, value] of Object.entries(fields)) {
                if (isStringMySQL(value)) {
                    columns.push(`\`${key}\` ${value} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
                } else {
                    columns.push(`\`${key}\` ${value}`)
                }
            }

            if (timestamp) {
                columns.push('createdAt DATETIME DEFAULT CURRENT_TIMESTAMP', 'updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }

            const query = `CREATE TABLE IF NOT EXISTS ${tableName} (id INT AUTO_INCREMENT PRIMARY KEY, ${columns.join(", ")}) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`;
            const [rows] = await execQuery({ query });
            return rows;
        }

        const select = async (table, { fields = ['*'], queryAtTheEnd = "", joins = [] } = {}) => {
            const query = `SELECT ${fields.join(", ")} FROM ${table} ${joins.length > 0 ? joinClause(table, joins) : ""} ${queryAtTheEnd}`;
            const [rows] = await execQuery({ query });
            return rows;
        }

        const bulkInsert = async (table, listFields = []) => {

            if (listFields.length === 0) return;
            const nonColumns = ['id', 'createdAt', 'updatedAt'];
            const itemDefault = (await execQuery({ query: `DESCRIBE ${table}` }))[0]
                ?.reduce((acc, cur) =>
                    nonColumns.includes(cur.Field) ? acc
                        : {
                            ...acc,
                            [cur.Field]: cur.Default ?? cur.Null === 'YES' ? null : ""
                        },
                    {})

            const values = listFields.map((field) => Object.values({
                ...itemDefault,
                ...field
            }))

            const query = `INSERT INTO ${table} (${Object.keys(itemDefault).join(", ")}) VALUES ?`;

            const [rows] = await execQuery({ query, data: [values] })
            return rows?.insertId;
        }

        const insert = async (table, fields) => {
            return await bulkInsert(table, [fields]);
        }

        const update = async (table, fields = {}, whereClause = "", connection) => {
            if (Object.keys(fields).length === 0) return;
            const dataSet = Object.entries(fields).map((item) => `${item[0]} = ?`).join(", ");
            const query = `UPDATE ${table} SET ${dataSet} ${whereClause}`;
            await execQuery({ query, data: Object.values(fields), connection });

            const querySelect = `SELECT ${Object.keys({ ...fields, id: null }).join(", ")} FROM ${table} ${whereClause}`
            const [dataUpdated] = await execQuery({ query: querySelect });
            return dataUpdated
        }

        const _delete = async (table, whereCondition = "", connection) => {
            const query = `DELETE FROM ${table} ${whereCondition}`;
            const [rows] = await execQuery({ query, connection });
            return rows;
        }

        // join = [{type, table, on}]
        const joinClause = (tableMain, joins = []) => {
            let data = "";
            try {
                if (!tableMain || joins.length === 0) throw Error('Param tableMain and joins is required');

                data = joins.reduce((acc, join) => {
                    join.on = join.on ?? 'id';
                    return `${acc} ${join.type ?? TYPE_JOIN.INNER_JOIN} ${join.table} ON ${tableMain}.${join.on} = ${join.table}.${join.on === 'id' ? `${tableMain.replace("tb_", "")}Id` : join.on}`;
                }, "");
                return data;
            } catch (error) {
                console.log(">>> ~ file: sql.service.js:105 ~ error: ", error)
                return data;
            }
        }

        const selectCondition = async (table, { fields = ['*'], join = [], ...condition } = {}) => {
            const op = condition && Object.keys(condition)[0];

            const { AND: dataAnd, OR: dataOr } = condition;
            const dataLoop = dataAnd ?? dataOr;

            const conditionClause = dataLoop && `WHERE `.concat(
                dataLoop.map((field) => Object.keys(field).map((key) => `${key} = ${field[key].toString().includes("@") ? `"${field[key]}"` : field[key]}`))
                    .join(` ${op} `)
            );

            return await select(table, { fields, queryAtTheEnd: conditionClause })
        }

        const transaction = async (cb) => {
            const connection = await db.mySQL.getConnection();
            try {
                await connection.beginTransaction();
                await cb(connection);
                await connection.commit();
            } catch (error) {
                console.log(">>> ~ file: sql.service.js:140 ~ transaction ~ error: ", error)
                await connection.rollback();
            } finally {
                connection.release();
            }
        }



        return {
            select, insert, bulkInsert, update, _delete, createTable, selectCondition, transaction
        }
    }
}