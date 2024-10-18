const db = require('../../middleware/database');
const { EmbedBuilder } = require('discord.js'); // Importando EmbedBuilder

// Template do Embed
function createEmbed(title, description, user, color = '#2c3e50') {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(description)
        .setFooter({ text: `Comando requisitado por ${user.username}` })
        .setTimestamp()
        .setThumbnail(user.avatarURL());
}

async function command(interaction, user) {
    if (!user.desmaio.desmaiado) {
        const embed = createEmbed('Erro', 'Você não está desmaiado.', interaction.user);
        return interaction.editReply({ content: '', embeds: [embed], ephemeral: true });
    }

    const minutosPassados = Date.now() - user.desmaio.lastDate;

    if (minutosPassados >= 20 * 60 * 1000) {
        user.life = user.maxLife - (user.maxLife * 0.25);
        user.desmaio.desmaiado = false;
        await db.update({ user: user.user }, user, 'user');

        const embed = createEmbed('Acordou', 'Você acordou novamente!', interaction.user);
        return interaction.editReply({ content: '', embeds: [embed], ephemeral: true });
    } else {
        const minutosRestantes = Math.ceil((20 * 60 * 1000 - minutosPassados) / 60000);
        const embed = createEmbed('Aguardando', `Ainda faltam ${minutosRestantes} minutos para você acordar.`, interaction.user);
        return interaction.editReply({ content: '', embeds: [embed], ephemeral: true });
    }
}

module.exports = command;
