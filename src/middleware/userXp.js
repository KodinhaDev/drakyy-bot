const levels = require('./items/levels');
const db = require('./database');

async function userXp(client, user){
    const xp = levels.find(level => level.level == user.level);
    if(user.xp >= xp.xp){
        user.xp = user.xp - xp.xp;
        user.level++;
        const userToNotify = await client.users.fetch(user.user);
        if(xp.m){
            user.money += xp.m;
            await userToNotify.send('Parabens! Você passou para o level **' + user.level + '**, e ganhou **' + xp.m +  '** Ouros.');
        }else{
            await userToNotify.send('Parabens! Você passou para o level ' + user.level);
        }
        return db.update({user: user.user}, user, 'user');
    }
}

module.exports = userXp;