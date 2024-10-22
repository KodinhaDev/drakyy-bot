const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fisicos = require('../../middleware/items/ataques');
const magicas = require('../../middleware/items/magicas');
var ataques = undefined;

async function command(interaction) {
    const tipo = interaction.options.getNumber('classe');
    if(tipo == 1){
        ataques = fisicos;
    }else{
        ataques = magicas;
    }
    const itensPorPagina = 5;
    let paginaAtual = 0;
    const totalPaginas = Math.ceil(ataques.length / itensPorPagina);

    function gerarEmbed(pagina) {
        const embed = new EmbedBuilder()
            .setColor('#2c3e50')
            .setTitle(`Aqui está a lista de todos os ataques ${tipo === 1 ? 'físicos' : 'de inata'}, ${interaction.user.username}!`)
            .setFooter({ text: `Comando requisitado por ${interaction.user.username}` })
            .setTimestamp()
            .setDescription('Para usar algum ataque dê /atacar {ataque}, caso você tenha o ataque.')
            .setThumbnail(interaction.user.avatarURL());

        const inicio = pagina * itensPorPagina;
        const fim = inicio + itensPorPagina;
        const ataquesPagina = ataques.slice(inicio, fim);

        ataquesPagina.forEach(ataque => {
            embed.addFields({
                name: `${ataque.name}: ${ataque.dmgBase} de dano, ${ataque.rating}% de acerto.`,
                value: `${ataque.description} libera no level ${tipo === 2 ? 'de inata' : ''} ${ataque.level}${tipo === 2 ? ', e gasta ' + ataque.energia + ' de energia amaldiçoada.' : '.'}`
            });
        });

        return embed;
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
