const { MongoClient } = require('mongodb');

class database{

    constructor(uri) {
        this.client = new MongoClient(uri);
        this.database = null;
        this.dbName = 'drakyy';
    }
    async connect(){
        await this.client.connect();
        this.database = this.client.db(this.dbName);
        console.log('🍃 | Conectado ao database.')
    }

    async insert(item, colecao){
        const result = await this.database.collection(colecao).insertOne(item);
        if(result.acknowledged){
            return true;
        }else{
            return false;
        }
    }

    async find(query, colecao){
        const user = await this.database.collection(colecao).findOne(query);
        if(user){
            return user;
        }else{
            return false;
        }
    }

    async delete(id, colecao){
        await this.database.collection(colecao).deleteOne({user: id})
    }

    async update(query, updateDoc, collectionName) {
        const collection = this.database.collection(collectionName);
        return await collection.updateOne(query, { $set: updateDoc });
    }


}

const db = new database(process.env.MONGO);
db.connect();
module.exports = db;