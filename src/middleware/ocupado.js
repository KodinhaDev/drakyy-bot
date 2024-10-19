const { EmbedBuilder } = require('discord.js');

async function ocupado(interaction, user){

    const embed = new EmbedBuilder()
    .setColor('#2c3e50')
        .setTitle('Erro')
        .setDescription('Você está impossibilitado de fazer ações, talvez esteja treinando ou descansando apos uma luta.')
        .setFooter({ text: `Comando requisitado por ${interaction.user.username}` })
        .setTimestamp()
        .setThumbnail(interaction.user.avatarURL());

    if(user.treinamento.emTreino){
        interaction.editReply({content: '', embeds: [embed], ephermal: true})
        return true
    }
    if(user.desmaio.desmaiado){
        interaction.editReply({content: '', embeds: [embed], ephermal: true})
        return true
    }

    
}

module.exports = ocupado;