const { EmbedBuilder } = require('discord.js');
const itemGet = require('../../middleware/items/itemController');

async function command(interaction, user) {
    if (!user) {
        return interaction.reply('Erro: usuário não encontrado.');
    }

    if (!Array.isArray(user.inventario) || user.inventario.length === 0) {
        let currentEmbed = new EmbedBuilder()
            .setColor('#2c3e50')  
            .setTitle(`Inventário de ${interaction.user.username} está vazio!`)
            .setDescription('Você ainda não possui itens em seu inventário. Comece a coletar itens para vê-los aqui!')
            .setFooter({ text: `Comando requisitado por ${interaction.user.username}` }) 
            .setTimestamp()
            .setThumbnail(interaction.user.avatarURL());
    
        return interaction.reply({ embeds: [currentEmbed] });
    }
    

    const maxFieldsPerEmbed = 25; 
    let embeds = []; 
    let currentEmbed = new EmbedBuilder()
        .setColor('#2c3e50')  
        .setTitle(`Inventário de ${interaction.user.username}!`)
        .setFooter({ text: `Comando requisitado por ${interaction.user.username}` }) 
        .setTimestamp()
        .setThumbnail(interaction.user.avatarURL());

    user.inventario.forEach((inv) => {
        if (inv && typeof inv === 'object' && typeof inv.quantidade === 'number') {
            if (currentEmbed.data.fields && currentEmbed.data.fields.length >= maxFieldsPerEmbed) {
                embeds.push(currentEmbed); 
                currentEmbed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle(`${interaction.user.username}'s Inventário`);
            }

            const item = itemGet(inv.id);

            currentEmbed.addFields({ name: item.name + ' - ' + inv.quantidade + ' unidade(s)', value: item.description, inline: true });
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
