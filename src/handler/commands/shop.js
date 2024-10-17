const { EmbedBuilder } = require('discord.js');
const items = require('../../middleware/items/items');

async function command(interaction) {
    var shop = new EmbedBuilder()
        .setColor('#2c3e50')
        .setTitle(`Seja bem vindo ao shop, ${interaction.user.username}!`)
        .setFooter({ text: `Comando requisitado por ${interaction.user.username}` })
        .setTimestamp()
        .setDescription('Para comprar os itens listados, de /comprar {item} {quantidade}.')
        .setThumbnail(interaction.user.avatarURL());
    items.forEach(item => {
        if (!item.value) return;
        shop.addFields({
            name: item.name + ' - R$' + item.value,
            value: !item.dmg
                ? item.description
                : item.description + ' - dano base de ' + item.dmg
        });
    });
    await interaction.reply({ embeds: [shop]})
}

module.exports = command;