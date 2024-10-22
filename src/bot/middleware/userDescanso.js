const db = require('./database');
const embedConstructor = require('./generateEmbed');

async function checkAwake(client, user) {
    
    if (!user || !user.desmaio.desmaiado) {
        return; 
    }

    const minutosPassados = Date.now() - user.desmaio.lastDate;

    if (minutosPassados >= 20 * 60 * 1000) {
        user.life = user.maxLife - (user.maxLife * 0.25);
        user.desmaio.desmaiado = false;
        await db.update({ user: user.user }, user, 'user');

        try {
            const userToNotify = await client.users.fetch(user.user);
            await userToNotify.send({embeds: [await embedConstructor('Aviso!', `<@${user.user}>, você acordou do seu descanso, já pode fazer suas ações normalmente.`)]});
        } catch (e) {
        }
    }
}

module.exports = checkAwake;
