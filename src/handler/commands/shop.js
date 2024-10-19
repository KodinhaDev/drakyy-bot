const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const items = require('../../middleware/items/items');

async function command(interaction) {
    let paginaAtual = 0;
    const itensPorPagina = 5;
    const totalPaginas = Math.ceil(items.length / itensPorPagina);

    function gerarEmbed(pagina) {
        const shop = new EmbedBuilder()
            .setColor('#2c3e50')
            .setTitle(`Seja bem vindo ao shop, ${interaction.user.username}!`)
            .setFooter({ text: `Comando requisitado por ${interaction.user.username}` })
            .setTimestamp()
            .setDescription('Para comprar os itens listados, de /comprar {item} {quantidade}.')
            .setThumbnail(interaction.user.avatarURL());

        const itensPagina = items.slice(pagina * itensPorPagina, (pagina + 1) * itensPorPagina);
        
        itensPagina.forEach(item => {
            if (!item.value) return;
            shop.addFields({
                name: item.name + ' - R$' + item.value,
                value: !item.dmg
                    ? item.description
                    : item.description + ' - dano base de ' + item.dmg
            });
        });

        return shop;
    }

    const botaoVoltar = new ButtonBuilder()
        .setCustomId('voltar')
        .setLabel('Voltar')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true); 

    const botaoProximo = new ButtonBuilder()
        .setCustomId('proximo')
        .setLabel('Próximo')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(totalPaginas <= 1);

    const row = new ActionRowBuilder().addComponents(botaoVoltar, botaoProximo);

    let msg = await interaction.editReply({ content: '', embeds: [gerarEmbed(paginaAtual)], components: [row] });

    const coletor = msg.createMessageComponentCollector({ time: 60000 }); 

    coletor.on('collect', async i => {
        if (i.customId === 'proximo') {
            paginaAtual++;
        } else if (i.customId === 'voltar') {
            paginaAtual--;
        }

        const novoEmbed = gerarEmbed(paginaAtual);

        botaoVoltar.setDisabled(paginaAtual === 0);
        botaoProximo.setDisabled(paginaAtual === totalPaginas - 1);

        await i.update({ embeds: [novoEmbed], components: [new ActionRowBuilder().addComponents(botaoVoltar, botaoProximo)] });
    });

    coletor.on('end', () => {
        botaoVoltar.setDisabled(true);
        botaoProximo.setDisabled(true);
        interaction.editReply({ components: [new ActionRowBuilder().addComponents(botaoVoltar, botaoProximo)] });
    });
}

module.exports = command;
