const db = require('./database');
// const db = new Database(process.env.MONGO);

const defaultUser = {
    'user': '',
    'afk': false,
    'money': 1000,
    'energia': 100,
    'energiaMax': 100,
    'life': 200,
    'maxLife': 200,
    'level': 0,
    'levelMagico': 0,
    'lastTurno': null,
    'xp': 0,
    'xpMagico': 0,
    'forca': 10,
    'turno': true,
    'treinamento': {
        emTreino: false,
        terminoTreino: null,
        tipo: null,
        tempo: null
    },
    'cla': {
        cla: null,
    },
    'desmaio': {
        desmaiado: false,
        lastDate: null,
        desmaios: 0,
    },
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
