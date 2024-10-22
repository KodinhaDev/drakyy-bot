const db = require('../../middleware/database');
const embedConstructor = require('../../middleware/generateEmbed');

async function command(interaction, user){
    if(user.lastTurno < Date.now() && user.turno == true){
        user.turno = false;
        user.afk = true;
        await db.update({user: user.user}, user, 'user')
        return interaction.editReply({content: '', embeds: [await embedConstructor('Afk', 'Você entrou no modo afk, ninguém poderá te atacar.', interaction.user)]})
    }else if(user.afk == true){
        user.afk = false;
        await db.update({user: user.user}, user, 'user')
        return interaction.editReply({content: '', embeds: [await embedConstructor('Afk', 'Você saiu do modo afk, todos poderão te atacar.', interaction.user)]})
    }else{
        return interaction.editReply({content: '', embeds: [await embedConstructor('Erro', 'Você não atende algum dos requisitos para entrar no modo afk, que são estar no seu turno e estar a 15 minutos sem atacar.', interaction.user)]})
    }
}

module.exports = command;