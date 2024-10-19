const db = require('./database');

async function treinamento(client, user) {

    const treinoData = user.treinamento.terminoTreino;
    if (Date.now() > treinoData) {
        var recompensa;
        if (user.treinamento.tipo == 1) {
            recompensa = 100 * user.treinamento.tempo;
            user.maxLife += recompensa;
            try {
                const userToNotify = await client.users.fetch(user.user);
                await userToNotify.send(`Seu treinamento acabou, seu treino de ${user.treinamento.tempo} horas foi um sucesso e te rendeu ${recompensa} de vida máxima a mais.`);
            } catch (e) {
                console.error(`Erro ao enviar mensagem ao usuário: ${e}`);
            }
        }
        if (user.treinamento.tipo == 2) {
            recompensa = 20 * user.treinamento.tempo;
            user.forca += recompensa;
            try {
                const userToNotify = await client.users.fetch(user.user);
                await userToNotify.send(`Seu treinamento acabou, seu treino de ${user.treinamento.tempo} horas foi um sucesso e te rendeu ${recompensa} de força a mais.`);
            } catch (e) {
                console.error(`Erro ao enviar mensagem ao usuário: ${e}`);
            }
        }
        if (user.treinamento.tipo == 3) { 
            recompensa = 100 * user.treinamento.tempo; 
            user.xpMagico += recompensa;
            user.energia += recompensa / 2;
            try {
                const userToNotify = await client.users.fetch(user.user);
                await userToNotify.send(`Seu treinamento acabou, seu treino de ${user.treinamento.tempo} horas foi um sucesso e te rendeu ${recompensa} de Xp Mágico e ${recompensa / 2} de Energia Amaldiçoada.`);
            } catch (e) {
                console.error(`Erro ao enviar mensagem ao usuário: ${e}`);
            }
        }
        user.treinamento.emTreino = false;
        user.treinamento.tipo = null;
        user.treinamento.tempo = null;
        user.treinamento.terminoTreino = null;

        await db.update({ user: user.user }, user, 'user');
    }
}

module.exports = treinamento;
