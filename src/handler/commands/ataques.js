const { EmbedBuilder } = require('discord.js');
const ataques = require('../../middleware/items/ataques');

async function command(interaction) {
    var ataquesEmbed = new EmbedBuilder()
        .setColor('#2c3e50')
        .setTitle(`Aqui esta a lista de todos ataques, ${interaction.user.username}!`)
        .setFooter({ text: `Comando requisitado por ${interaction.user.username}` })
        .setTimestamp()
        .setDescription('Para usar algum dos ataque dê /atacar {ataque}, caso você tenha o ataque.')
        .setThumbnail(interaction.user.avatarURL());
        ataques.forEach(ataque => {
            ataquesEmbed.addFields({
            name: `${ataque.name} - ${ataque.dmgBase} ⚔️`,
            value: ataque.description
        });
    });
    await interaction.reply({ embeds: [ataquesEmbed]})
}

module.exports = command;