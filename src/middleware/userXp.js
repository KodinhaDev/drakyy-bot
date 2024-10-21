const levels = require('./items/levels');
const db = require('./database');
const embedConstructor = require('./generateEmbed');

async function userXp(client, user) {
    let leveledUp = false;

    while (true) {
        const xp = levels.find(level => level.level == user.level);
        if (xp == undefined || user.xp < xp.xp) break;

        user.xp -= xp.xp;
        user.level++;
        leveledUp = true;

        const userToNotify = await client.users.fetch(user.user);
        try {
            if (xp.m) {
                user.money += xp.m;
                await userToNotify.send({
                    embeds: [await embedConstructor('Parabéns!', 'Você passou para o level **' + user.level + '**, e ganhou **' + xp.m + '** Ouros.')]
                });
            } else {
                await userToNotify.send({
                    embeds: [await embedConstructor('Parabéns!', 'Você passou para o level ' + user.level)]
                });
            }
        } catch (e) {
        }
    }

    while (true) {
        const xpMagico = levels.find(level => level.level == user.levelMagico);
        if (xpMagico == undefined || user.xpMagico < xpMagico.xp) break;

        user.xpMagico -= xpMagico.xp;
        user.levelMagico++;
        leveledUp = true;

        const userToNotify = await client.users.fetch(user.user);
        try {
            if (xpMagico.m) {
                user.money += xpMagico.m * 3;  
                await userToNotify.send({
                    embeds: [await embedConstructor('Parabéns!', 'Você passou para o level mágico **' + user.levelMagico + '**, e ganhou **' + xpMagico.m + '** Ouros.')]
                });
            } else {
                await userToNotify.send({
                    embeds: [await embedConstructor('Parabéns!', 'Você passou para o level mágico ' + user.levelMagico + '.')]
                });
            }
        } catch (e) {
        }
    }

    if (leveledUp) {
        return db.update({ user: user.user }, user, 'user');
    }
}

module.exports = userXp;
