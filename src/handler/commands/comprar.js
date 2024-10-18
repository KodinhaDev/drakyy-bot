const items = require('../../middleware/items/items');
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
    try {
        const itemId = parseInt(interaction.options.getString('item'));
        let quantidade = interaction.options.getNumber('quantidade');

        if (quantidade === null) {
            quantidade = 1;
        }

        const item = items.find(item => item.id === itemId);

        if (!item) {
            const embed = createEmbed('Erro', 'Item não encontrado.', interaction.user);
            return interaction.editReply({ content: '', embeds: [embed], ephemeral: true });
        }

        const totalValue = item.value * quantidade;

        if (totalValue > user.money) {
            const embed = createEmbed('Erro', 'Você não tem dinheiro suficiente para comprar isso.', interaction.user);
            return interaction.editReply({ content: '', embeds: [embed], ephemeral: true });
        }

        const itemInv = user.inventario.find(inv => inv.id === itemId);
        
        if (itemInv) {
            itemInv.quantidade += quantidade;
        } else {
            user.inventario.push({ id: itemId, quantidade: quantidade });
        }

        user.money -= totalValue;

        await db.delete(interaction.user.id, 'user');
        await db.insert(user, 'user');
        
        const successEmbed = createEmbed('Compra Realizada', `Você comprou **${quantidade}x ${item.name}** por **${totalValue}R$**!`, interaction.user);
        return interaction.editReply({ content: '', embeds: [successEmbed], ephemeral: true });
    } catch (error) {
        console.error('Erro ao processar a compra:', error);
        const embed = createEmbed('Erro', 'Ocorreu um erro ao realizar a compra. Tente novamente mais tarde.', interaction.user);
        return interaction.editReply({ content: '', embeds: [embed], ephemeral: true });
    }
}

module.exports = command;