const db = require('./database');

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
            await userToNotify.send('Você acordou do seu desmaio!');
        } catch (e) {
        }
    }
}

module.exports = checkAwake;
