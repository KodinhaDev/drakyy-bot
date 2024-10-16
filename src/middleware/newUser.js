const Database = require('./database');
const db = new Database(process.env.MONGO);

async function newUser(id){

    await db.connect()

    const user = await db.find({'user': id}, 'user');
    if(user){
        await db.end();
        return user;
        
    }else{
        const userValue = {
            'user': id, 
            'money': 1000, 
            'mana': 100, 
            'life': 200, 
            'forca': 10, 
            'velocidade': 10, 
            'kokusens': 0, 
            'inventario': [ 

                ]
            }
                ;
        await db.insert(userValue, 'user');
        await db.end()
        return userValue;
    }


}

module.exports = newUser;