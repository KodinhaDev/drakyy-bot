const db = require('../../middleware/database');
const embedConstructor = require('../../middleware/generateEmbed');
const itemFinder = require('../../middleware/items/itemController');

async function command(interaction, user) {
    user = await db.find({user: interaction.user.id}, 'user');
    const subcommand = interaction.options.getSubcommand();
    const subcommandGroup = interaction.options.getSubcommandGroup(false);

    if (subcommandGroup === 'add') {
        if (subcommand === 'item') {
            const selectedItem = interaction.options.getNumber('item');
            const foundItem = user.inventario.find(item => item.id == selectedItem && item.quantidade >= 1); // Use find para localizar o item

            if (foundItem) { // Verifica se o item foi encontrado
                const itemFind = itemFinder(selectedItem);
                foundItem.quantidade--; // Decrementa a quantidade do item

                const trade = await db.find({ id: user.trade.id }, 'trade');

                if (trade.requestBy == user.user) {
                    const itemTrade = trade.requesterItens.find(item => item.id == selectedItem);
                    if (itemTrade == undefined) {
                        trade.requesterItens.push({ id: selectedItem, quantidade: 1, name: itemFind.name });
                    } else {
                        itemTrade.quantidade++;
                    }
                } else {
                    const itemTrade = trade.reciverItens.find(item => item.id == selectedItem);
                    if (itemTrade == undefined) {
                        trade.reciverItens.push({ id: selectedItem, quantidade: 1, name: itemFind.name });
                    } else {
                        itemTrade.quantidade++;
                    }
                }

                await db.update({ id: user.trade.id }, trade, 'trade');
                await db.update({ user: user.user }, user, 'user');

                return interaction.editReply({ content: '', embeds: [await embedConstructor('Trade', 'Item adicionado à trade.', interaction.user)] });
            } else {
                return interaction.editReply({ content: '', embeds: [await embedConstructor('Erro', 'Você não tem esse item.', interaction.user)] });
            }


        } else if (subcommand === 'money') {
            const quantia = interaction.options.getNumber('quantia');
            if (user.money < quantia) return await interaction.editReply({ content: '', embeds: [await embedConstructor('Erro', 'Você não tem dinheiro suficiente para adicionar.', interaction.user)] });

            const trade = await db.find({ id: user.trade.id }, 'trade');
            const secondUser = await db.find({ user: trade.sendTo }, 'user');
            let money;

            if (trade.requestBy === user.user) {
                user.money -= quantia;
                money = trade.requesterItens.find(item => item.money !== undefined) || { money: 0 };
                money.money += quantia;
                if (!trade.requesterItens.includes(money)) trade.requesterItens.push(money);
            } else {
                secondUser.money -= quantia;
                money = trade.reciverItens.find(item => item.money !== undefined) || { money: 0 };
                money.money += quantia;
                if (!trade.reciverItens.includes(money)) trade.reciverItens.push(money);
            }

            await db.update({ id: user.trade.id }, trade, 'trade');
            await db.update({ user: secondUser.user }, secondUser, 'user');
            await db.update({ user: user.user }, user, 'user');
            await interaction.editReply({ content: '', embeds: [await embedConstructor('Trade', `${quantia} de ouro adicionado na trade por <@${interaction.user.id}>.`, interaction.user)] });
        }
    } else if (subcommand === 'user') {
        console.log(`user trade: ${user.trade.trade}`);
        const player = interaction.options.getUser('player');
        if (player.bot) return await interaction.editReply({ content: '', embeds: [await embedConstructor('Trade', 'Não se pode iniciar trade com um bot.', interaction.user)] });
        if (player.id == interaction.user.id) return await interaction.editReply({ content: '', embeds: [await embedConstructor('Trade', 'Não pode fazer troca consigo mesmo.', interaction.user)] });
        
        const dbPlayer = await db.find({ user: player.id }, 'user');
        console.log(`user trade: ${dbPlayer.trade.trade}`);
        if (user.trade.trade == true || dbPlayer.trade.trade == true) return await interaction.editReply({ content: '', embeds: [await embedConstructor('Erro', 'Um de vocês dois já estão em uma trade.', interaction.user)] });

        const trade = {
            id: interaction.user.id + player.id,
            requestBy: interaction.user.id,
            sendTo: player.id,
            requesterItens: [{ money: 0 }],
            reciverItens: [{ money: 0 }],
            req: false,
            sen: false
        };

        dbPlayer.trade.trade = true;
        user.trade.trade = true;
        dbPlayer.trade.id = trade.id;
        user.trade.id = trade.id;
        console.log(`user trade 2: ${user.trade.trade}`);
        console.log(`user trade 2: ${dbPlayer.trade.trade}`);
        await db.insert(trade, 'trade');
        await db.update({ user: player.id }, dbPlayer, 'user');
        await db.update({ user: user.user }, user, 'user');
        await interaction.editReply({ content: '', embeds: [await embedConstructor('Trade', `Uma trade entre <@${interaction.user.id}> e <@${player.id}> foi iniciada.`, interaction.user)] });
    } else if (subcommand === 'accept') {
        if (user.trade.trade) {
            const trade = await db.find({ id: user.trade.id }, 'trade');
            if (!trade) return await interaction.editReply({ content: '', embeds: [await embedConstructor('Erro', 'Trade não encontrada.', interaction.user)] });
        
            const secondUser = await db.find({ user: trade.sendTo }, 'user');
        
            if (!secondUser) return await interaction.editReply({ content: '', embeds: [await embedConstructor('Erro', 'Usuário da trade não encontrado.', interaction.user)] });
        
            // Atualizar status de aceitação da trade
            if(trade.requestBy == user.user){
                trade.req = true;
                await db.update({ id: user.trade.id }, trade, 'trade');
                if(trade.sen == false) return await interaction.editReply({ content: '', embeds: [await embedConstructor('Trade', 'Esperando que o outro usuário aceite a troca.', interaction.user)] });
            } else {
                trade.sen = true;
                await db.update({ id: user.trade.id }, trade, 'trade');
                if(trade.req == false) return await interaction.editReply({ content: '', embeds: [await embedConstructor('Trade', 'Esperando que o outro usuário aceite a troca.', interaction.user)] });
            }
        
            // Transferir itens de requestBy para sendTo
            trade.requesterItens.forEach(item => {
                const itemInReceiverInventory = secondUser.inventario.find(temp => temp.id === item.id);
                if (itemInReceiverInventory) {
                    itemInReceiverInventory.quantidade += item.quantidade;
                } else {
                    secondUser.inventario.push({ id: item.id, quantidade: item.quantidade });
                }
            });
        
            // Transferir itens de sendTo para requestBy
            trade.reciverItens.forEach(item => {
                const itemInRequesterInventory = user.inventario.find(temp => temp.id === item.id);
                if (itemInRequesterInventory) {
                    itemInRequesterInventory.quantidade += item.quantidade;
                } else {
                    user.inventario.push({ id: item.id, quantidade: item.quantidade });
                }
            });
        
            // Transferir dinheiro se houver
            const requesterMoney = trade.requesterItens.find(item => item.money != undefined);
            if (requesterMoney) secondUser.money += requesterMoney.money;
        
            const receiverMoney = trade.reciverItens.find(item => item.money != undefined);
            if (receiverMoney) user.money += receiverMoney.money;
        
            // Finalizar trade
            await db.delete2({ id: user.trade.id }, 'trade');
            user.trade.trade = false;
            secondUser.trade.trade = false;
            user.trade.id = null;
            secondUser.trade.id = null;
        
            await db.update({ user: secondUser.user }, secondUser, 'user');
            await db.update({ user: user.user }, user, 'user');
            
            await interaction.editReply({ content: '', embeds: [await embedConstructor('Trade', `Trade entre <@${interaction.user.id}> e <@${secondUser.user}> foi finalizada com sucesso.`, interaction.user)] });
        } else {
            await interaction.editReply({ content: '', embeds: [await embedConstructor('Erro', 'Você não está em nenhuma trade para poder finalizar.', interaction.user)] });
        }
        
    } else if (subcommand === 'cancel') {
        if (user.trade.trade) {
            const trade = await db.find({ id: user.trade.id }, 'trade');
            if (!trade) return await interaction.editReply({ content: '', embeds: [await embedConstructor('Erro', 'Trade não encontrada.', interaction.user)] });
        
            const secondUser = await db.find({ user: trade.sendTo }, 'user');
            if (!secondUser) return await interaction.editReply({ content: '', embeds: [await embedConstructor('Erro', 'Usuário da trade não encontrado.', interaction.user)] });
        
            const items = user.user === trade.requestBy ? trade.requesterItens : trade.reciverItens;
            items.forEach(item => {
                const itemInInventory = user.user === trade.requestBy ? user.inventario : secondUser.inventario;
                const existingItem = itemInInventory.find(temp => temp.id === item.id);
                existingItem ? existingItem.quantidade += item.quantidade : itemInInventory.push({ id: item.id, quantidade: item.quantidade });
            });

            if(trade.requestBy == user.user){
                const item = trade.requesterItens.find(item => item.money != undefined)
                user.money += item.money
                const item2 = trade.reciverItens.find(item => item.money != undefined)
                secondUser.money += item2.money
            }else{
                const item = trade.requesterItens.find(item => item.money != undefined)
                secondUser.money += item.money
                const item2 = trade.reciverItens.find(item => item.money != undefined)
                user.money += item2.money
            }
        
            user.trade.trade = false;
            secondUser.trade.trade = false;
            secondUser.trade.id = null;
            await db.delete2({ id: user.trade.id }, 'trade');
            user.trade.id = null;
            await db.update({ user: user.user }, user, 'user');
            await db.update({ user: secondUser.user }, secondUser, 'user');
            await interaction.editReply({ content: '', embeds: [await embedConstructor('Trade', `Trade entre <@${interaction.user.id}> e <@${secondUser.user}> foi cancelada por <@${interaction.user.id}>.`, interaction.user)] });
        } else {
            await interaction.editReply({ content: '', embeds: [await embedConstructor('Erro', 'Você não está em nenhuma trade para poder cancelar.', interaction.user)] });
        }
        
    } else {
        if (user.trade.trade) {
            const trade = await db.find({ id: user.trade.id }, 'trade');
            const embed = await embedConstructor('Trade em andamento', `Aqui estão as informações da trade, <@${interaction.user.id}>!`, interaction.user);
            embed.addFields({ name: `**Itens de <@${trade.requestBy}>**`, value: 'itens abaixo:' });
            trade.requesterItens.forEach(item => {
                if (item.money != undefined) {
                    embed.addFields({ name: 'Money', value: item.money.toString() });
                }
                if (item.name && item.quantidade) {
                    embed.addFields({ name: item.name, value: item.quantidade.toString() + ' unidade(s).' });
                }
            });
            embed.addFields({ name: `**Itens de <@${trade.sendTo}>**`, value: 'itens abaixo:' });
            trade.reciverItens.forEach(item => {
                if (item.money >= 0) {
                    embed.addFields({ name: 'Money', value: item.money.toString() });
                }
                if (item.name && item.quantidade) {
                    embed.addFields({ name: item.name, value: item.quantidade.toString() + ' unidade(s).' });
                }
            });
            await interaction.editReply({ content: '', embeds: [embed] });
        } else {
            await interaction.editReply({ content: '', embeds: [await embedConstructor('Trade', 'Para iniciar um trade com alguém, dê /trade user {usuário}.', interaction.user)] });
        }
    }
}

module.exports = command;
