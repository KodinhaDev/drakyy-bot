const embedConstructor = require('./generateEmbed');
const db = require('./database');

async function turno(client, user) {
    if (user.lastTurno && user.lastTurno < Date.now()) {
        user.lastTurno = null; // Reseta o lastTurno para null
        user.turno = true; // Permite que o usuário ataque novamente

        // Obtém o usuário do Discord
        const usuarioDc = await client.users.fetch(user.user);

        // Envia mensagem ao usuário no Discord
        await usuarioDc.send({
            embeds: [await embedConstructor('Aviso!', 'Já se passaram 5 minutos do seu último turno, e você não foi atacado. Ou seja, você pode atacar novamente.')]
        });

        // Atualiza o usuário no banco de dados
        db.update({ user: user.user }, user, 'user');
    }
}

module.exports = turno;
