const db = require('./database');
// const db = new Database(process.env.MONGO);

const defaultUser = {
    'user': '',
    'money': 1000,
    'mana': 100,
    'life': 200,
    'level': 0,
    'xp': 0,
    'maxLife': 200,
    'forca': 10,
    'turno': true,
    'velocidade': 10,
    'desmaio': {
        desmaiado: false,
        lastDate: null,
        desmaios: 0,
    },
    'ataques': [
        {id: 1},
        {id: 2}
    ],
    'inventario': []
};

async function newUser(id) {
    // await db.connect();
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
        return user;
    } else {
        const newUserValue = { ...defaultUser, 'user': id };
        await db.insert(newUserValue, 'user');
        return newUserValue;
    }
}

module.exports = newUser;
