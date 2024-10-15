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
        // console.log('🍃 | Conexão com o database estabelecida.')
    }

    async end(){
        await this.client.close();
        this.database = null;
        // console.log('🍃 | Conexão com o database encerrada.')
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


}

module.exports = database;