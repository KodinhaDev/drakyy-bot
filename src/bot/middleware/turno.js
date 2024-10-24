const embedConstructor = require('./generateEmbed');
const db = require('./database');

async function turno(client, user) {
    if (user.turno == false && user.lastTurno < Date.now() && user.afk == false) {
        user.turno = true; 
        user.lastTurno = Date.now();

        const usuarioDc = await client.users.fetch(user.user);

        try{
        await usuarioDc.send({
            embeds: [await embedConstructor('Aviso!', 'Já se passaram 15 minutos do seu último turno, e você não foi atacado. Ou seja, você pode atacar novamente.')]
        });
    }catch(e){
    }

        db.update({ user: user.user }, user, 'user');
    }
}

module.exports = turno;
