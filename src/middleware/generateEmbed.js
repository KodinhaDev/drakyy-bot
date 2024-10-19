const { EmbedBuilder } = require('discord.js');

async function generateEmbed(title, description, user) {
    const embed = new EmbedBuilder()
        .setColor('#2c3e50')
        .setTitle(title)
        .setDescription(description)
        .setTimestamp();
    if (user) {
        embed.setFooter({ text: `Comando requisitado por ${user.username}` });
    }

    return embed;
}

module.exports = generateEmbed;
