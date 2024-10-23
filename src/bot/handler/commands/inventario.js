const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const itemGet = require('../../middleware/items/itemController');
const db = require('../../middleware/database');
const newuser = require('../../middleware/newUser');

async function command(interaction, user) {
    user.inventario = user.inventario.filter(item => item.quantidade != 0 || item.quantidade != null)
    const usuario = interaction.options.getUser('usuario');
    try {
        if(usuario) await newuser(usuario.id);
    } catch (e) {
    }

    if (usuario != null) {
        user = await db.find({ user: usuario.id }, 'user');
        if (!user) {
            return interaction.editReply({ content: 'Usuário não registrado no database.', ephemeral: true });
        }
        interaction.user = usuario;
    }

    if (!Array.isArray(user.inventario) || user.inventario.length === 0) {
        let emptyEmbed = new EmbedBuilder()
            .setColor('#2c3e50')
            .setTitle(`Inventário de ${interaction.user.username} está vazio!`)
            .setDescription('Você ainda não possui itens em seu inventário. Comece a coletar itens para vê-los aqui!')
            .setFooter({ text: `Comando requisitado por ${interaction.user.username}` })
            .setTimestamp()
            .setThumbnail(interaction.user.avatarURL());

        return interaction.editReply({ content: '', embeds: [emptyEmbed] });
    }

    const itensPorPagina = 5; 
    let paginaAtual = 0;
    const totalPaginas = Math.ceil(user.inventario.length / itensPorPagina);

    function gerarEmbed(pagina) {
        let inventarioEmbed = new EmbedBuilder()
            .setColor('#2c3e50')
            .setTitle(`Inventário de ${interaction.user.username}!`)
            .setFooter({ text: `Comando requisitado por ${interaction.user.username}` })
            .setTimestamp()
            .setThumbnail(interaction.user.avatarURL());

        const inicio = pagina * itensPorPagina;
        const fim = inicio + itensPorPagina;
        const itensPagina = user.inventario.slice(inicio, fim);

        itensPagina.forEach(inv => {
            if (inv && typeof inv === 'object' && typeof inv.quantidade === 'number') {
                const item = itemGet(inv.id);
                inventarioEmbed.addFields({
                    name: `${item.name} - ${inv.quantidade} unidade(s)`,
                    value: item.description,
                    inline: true
                });
            } else {
            }
        });

        return inventarioEmbed;
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