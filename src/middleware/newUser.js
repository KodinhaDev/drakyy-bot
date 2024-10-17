const Database = require('./database');
const db = new Database(process.env.MONGO);

const defaultUser = {
    'user': '',
    'money': 1000,
    'mana': 100,
    'life': 200,
    'forca': 10,
    'turno': true,
    'velocidade': 10,
    'kokusens': 0,
    'inventario': []
};

async function newUser(id) {
    await db.connect();
    let user = await db.find({ 'user': id }, 'user');
    
    if (user) {
        let updated = false;
        for (let key in defaultUser) {
            if (!(key in user)) {
                user[key] = defaultUser[key];
                updated = true;
            }
        }

        if (updated) await db.update({ 'user': id }, user, 'user');
        await db.end();
        return user;
    } else {
        const newUserValue = { ...defaultUser, 'user': id };
        await db.insert(newUserValue, 'user');
        await db.end();
        return newUserValue;
    }
}

module.exports = newUser;
