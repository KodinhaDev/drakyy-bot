const db = require('../../middleware/database');
const newuser = require('../../middleware/newUser');
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
    const usuario = interaction.options.getUser('usuario');
    try {
        await newuser(usuario.id);
    } catch (e) {}

    const quantia = interaction.options.getNumber('quantia');
    if (interaction.user.id == usuario.id) {
        const embed = createEmbed('Erro', 'Você não pode enviar dinheiro para si mesmo.', interaction.user);
        return interaction.editReply({ content: '', embeds: [embed], ephemeral: true });
    }

    const destinatario = await db.find({ user: usuario.id }, 'user');
    if (user.money < quantia || quantia < 0) {
        const embed = createEmbed('Erro', 'Você não tem dinheiro suficiente para enviar esta quantia.', interaction.user);
        return interaction.editReply({ content: '', embeds: [embed], ephemeral: true });
    }
    
    if (destinatario) {
        destinatario.money += quantia;
        user.money -= quantia;
        await db.update({ user: destinatario.user }, destinatario, 'user');
        await db.update({ user: user.user }, user, 'user');

        try {
            await usuario.send(`Você recebeu um pagamento de ${interaction.user.username} no valor de ${quantia}R$, no canal <#${interaction.channel.id}>!`);
        } catch (e) {}

        const embed = createEmbed('Pagamento Realizado', `Pagamento de **${quantia}R$** enviado com sucesso para ${usuario.username}.`, interaction.user);
        return interaction.editReply({ content: '', embeds: [embed], ephemeral: false });
    } else {
        const embed = createEmbed('Erro', 'Usuário não encontrado no nosso database.', interaction.user);
        return interaction.editReply({ content: '', embeds: [embed], ephemeral: true });
    }
}

module.exports = command;
