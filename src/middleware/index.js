const newuser = require('./newUser');
const descanso = require('./userDescanso');
const userXp = require('./userXp');
const treinamento = require('./treinamento');
const turno = require('./turno');

async function middlewares(client, userid){
    var user = await newuser(userid);
    await descanso(client, user);
    await userXp(client, user);
    await treinamento(client, user);
    await turno(client, user);
    user = await newuser(userid);
    return user
}

module.exports = middlewares;