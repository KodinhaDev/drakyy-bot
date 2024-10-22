const { EmbedBuilder } = require('discord.js');
const db = require('../../../middleware/database');

async function command(interaction, user) {
    const embedSucesso = new EmbedBuilder()
        .setColor('#2c3e50')
        .setTitle('Kit primeiros socorros usado com sucesso')
        .setDescription('Você usou o kit médico e recuperou sua vida toda.')
        .setFooter({ text: `Comando requisitado por ${interaction.user.username}` })
        .setTimestamp()
        .setThumbnail(interaction.user.avatarURL());

    const embedErro = new EmbedBuilder()
        .setColor('#2c3e50')
        .setTitle('Erro')
        .setDescription('Você não tem kits ou já esta com a vida máxima.')
        .setFooter({ text: `Comando requisitado por ${interaction.user.username}` })
        .setTimestamp()
        .setThumbnail(interaction.user.avatarURL());

    const embedInexistente = new EmbedBuilder()
        .setColor('#2c3e50')
        .setTitle('Erro')
        .setDescription('Você não pode usar kit, pois não está no seu turno.')
        .setFooter({ text: `Comando requisitado por ${interaction.user.username}` })
        .setTimestamp()
        .setThumbnail(interaction.user.avatarURL());

    if(user.turno == false){
            return interaction.editReply({content: '', embeds: [embedInexistente]});
    }

    if(user.life == user.maxLife){
            return interaction.editReply({content: '', embeds: [embedErro]});
    }

    let quantidade = false;
    user.inventario.forEach(item => {
        if (item.id === 2) {  
            quantidade = item.quantidade;
        }
    });

    if (quantidade && quantidade > 0) {
        user.inventario.forEach(item => {
            if (item.id === 2) {
                item.quantidade -= 1; 
            }
        });
        user.life = user.maxLife; 
        user.turno = false;
        user.lastTurno = Date.now() + 15 * 60 * 1000;
        await db.update({ user: user.user }, user, 'user');  
        await interaction.editReply({content: '', embeds: [embedSucesso] });  
    } else {
        await interaction.editReply({content: '', embeds: [embedErro] });  
    }
}

module.exports = command;
