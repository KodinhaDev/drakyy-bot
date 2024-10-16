const { EmbedBuilder } = require('discord.js');

function command(interaction, user) {
    const embed = new EmbedBuilder()
        .setColor('#2c3e50') 
        .setTitle(`Perfil de ${interaction.user.username}`)
        .setDescription(`Aqui estão suas informações, ${interaction.user.username}!`)
        .addFields(
            { name: '💰 | Dinheiro', value: `${user.money}`, inline: true },
            { name: '🪄 | Mana', value: `${user.mana}`, inline: true },
            { name: '❤️ | Vida', value: `${user.life}`, inline: true },
            { name: '💪 | Força', value: `${user.forca}`, inline: true },
            { name: '🏃‍♂️ | Velocidade', value: `${user.velocidade}`, inline: true },
            { name: '🌌 | Kokusens', value: `${user.kokusens}`, inline: true },
        )
        .setThumbnail(interaction.user.avatarURL()) 
        .setFooter({ text: `Comando requisitado por ${interaction.user.username}` }) 
        .setTimestamp(); 

    interaction.reply({ embeds: [embed] });
}

module.exports = command;
