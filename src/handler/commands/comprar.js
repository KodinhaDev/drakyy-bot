const items = require('../../middleware/items/items');
const Database = require('../../middleware/database');
const db = new Database(process.env.MONGO);

async function command(interaction, user) {
    await db.connect();
    
    try {
        const itemId = parseInt(interaction.options.getString('item'));
        let quantidade = interaction.options.getNumber('quantidade');

        if (quantidade === null) {
            quantidade = 1;
        }

        const item = items.find(item => item.id === itemId);

        if (!item) {
            return interaction.editReply({ content: 'Item não encontrado.', ephemeral: true });
        }

        const totalValue = item.value * quantidade;

        if (totalValue > user.money) {
            return interaction.editReply({ content: 'Você não tem dinheiro suficiente para comprar isso.', ephemeral: true });
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
        
        interaction.editReply({ content: 'Compra realizada com sucesso!', ephemeral: true });
    } catch (error) {
        console.error('Erro ao processar a compra:', error);
        interaction.editReply({ content: 'Ocorreu um erro ao realizar a compra. Tente novamente mais tarde.', ephemeral: true });
    } finally {
        await db.end();
    }
}

module.exports = command;
