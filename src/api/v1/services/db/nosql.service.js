const { db } = require("@src/configs/db.config")
module.exports = {
    mongoDBService: () => {
        const createModel = (documentName, { fields, values } = {}) => {
            const mongoSchema = new db.mongoDB.Schema(fields);
            const mongoModel = db.mongoDB.model(documentName, mongoSchema);
            const data = new mongoModel(values);
            data.save();
            return data;
        }
        const getModel = (modelName) => db.mongoDB.model(modelName, {});
        return { createModel, getModel }
    },
    redisService: () => {
        const set = async (key, value, expires) => {
            if (expires)
                return await db.redis.setex(key, expires, value);
            return await db.redis.set(key, value)
        };
        const get = async (key) => await db.redis.get(key);
        const del = async (key) => await db.redis.del(key);
        const ttl = async (key) => await db.redis.ttl(key);
        const update = async (key, value) => {
            const ttl = await ttl(key);
            return await del(key)
                .then(async () => await set(key, value, ttl))
                .then(async () => await get(key));
        }
        return { set, get, del, update, ttl }
    }
}