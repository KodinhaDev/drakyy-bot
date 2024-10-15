const { EmbedBuilder } = require('discord.js');

async function command(interaction, user) {
    if (!user) {
        return interaction.reply('Erro: usuário não encontrado.');
    }

    if (!Array.isArray(user.inventario) || user.inventario.length === 0) {
        return interaction.reply('Seu inventário está vazio.');
    }

    const maxFieldsPerEmbed = 25; 
    let embeds = []; 
    let currentEmbed = new EmbedBuilder()
        .setColor('#2c3e50')  
        .setTitle(`Inventário de ${interaction.user.username}!`)
        .setFooter({ text: `Comando requisitado por ${interaction.user.username}` }) 
        .setTimestamp()
        .setThumbnail(interaction.user.avatarURL());

    user.inventario.forEach((inv, index) => {
        if (inv && typeof inv === 'object' && inv.nome && typeof inv.quantidade === 'number') {
            if (currentEmbed.data.fields && currentEmbed.data.fields.length >= maxFieldsPerEmbed) {
                embeds.push(currentEmbed); 
                currentEmbed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle(`${interaction.user.username}'s Inventário`);
            }

            currentEmbed.addFields({ name: inv.nome, value: `${inv.quantidade} unidade(s)`, inline: true });
        } else {
            console.error('Item inválido no inventário:', inv);
        }
    });

    if (currentEmbed.data.fields && currentEmbed.data.fields.length > 0) {
        embeds.push(currentEmbed);
    }

    for (const embed of embeds) {
        await interaction.reply({ embeds: [embed]});
    }
}

module.exports = command;
