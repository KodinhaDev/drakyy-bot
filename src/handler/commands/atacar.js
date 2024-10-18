const db = require('../../middleware/database');
const ataqueFind = require('../../middleware/items/ataqueController');
const newuser = require('../../middleware/newUser');
const { EmbedBuilder } = require('discord.js');

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
    const usuario = await interaction.options.getUser('user');
    if(usuario.id == user.user){
        return await interaction.editReply({ content: '', embeds: [createEmbed('Erro', 'Você não pode se auto-atacar.', usuario)]})
    }
    try {
        await newuser(usuario.id);
    } catch (e) {}

    const ataqueId = await interaction.options.getNumber('ataque');
    const ataque = ataqueFind(ataqueId);

    var dano = Math.floor(ataque.dmgBase * (1 + (user.forca / 100)));
    const userAtacado = await db.find({ user: usuario.id }, 'user');

    if (userAtacado.life <= 0) {
        const embed = createEmbed(`Ação com ${usuario.username}`, 'Este usuário está desmaiado.', usuario);
        return await interaction.editReply({content: '', embeds: [embed], ephemeral: true });
    }
    if (user.life <= 0) {
        const embed = createEmbed(`Ação com ${usuario.username}`, 'Você está desmaiado. Dê /descansar para mais informações.', usuario);
        return await interaction.editReply({content: '', embeds: [embed], ephemeral: true });
    }

    if (user.turno === false) {
        const embed = createEmbed(`Ação com ${usuario.username}`, 'Você já deu seu ataque, espere ser atacado para atacar novamente.', usuario);
        return await interaction.editReply({content: '', embeds: [embed], ephemeral: true });
    }

    const chance = Math.floor(Math.random() * 101);
    if(chance > ataque.rating){
        userAtacado.turno = true;
        user.turno = false;
        await db.update({ user: user.user }, user, 'user');
        await db.update({ user: userAtacado.user }, userAtacado, 'user');
        return await interaction.editReply({
            content: '',
            embeds: [createEmbed(`Ação com ${usuario.username}`, usuario.username + ' Conseguiu defender, e você perdeu o turno.', interaction.user)]
        });
    }
    var critico = false;
    if(chance >= 95){
        dano *=3;
        critico = true;
    }
    userAtacado.life -= dano;

    if (userAtacado.life <= 0) {
        userAtacado.life = 0;
        userAtacado.turno = true;
        userAtacado.desmaio.desmaiado = true;
        userAtacado.desmaio.lastDate = Date.now();
        userAtacado.desmaio.desmaios++;
        user.turno = false;
        user.xp += dano + 50;
        let embed
        if(critico){
            embed = createEmbed(`Desmaio de ${usuario.username}`, `O usuário <@${userAtacado.user}> foi desmaiado por <@${user.user}>, usando um ${ataque.name}, após um ataque crítico`, usuario);
        }else{
            embed = createEmbed(`Desmaio de ${usuario.username}`, `O usuário <@${userAtacado.user}> foi desmaiado por <@${user.user}>, usando um ${ataque.name}.`, usuario);
        }
        await interaction.editReply({content: '', embeds: [embed], ephemeral: false });
    } else {
        userAtacado.turno = true;
        user.turno = false;
        user.xp += dano;
        let embed
        if(critico){
        embed = createEmbed(`Ataque de ${interaction.user.username}`, 'Você atacou com sucesso o usuário, dando '+ dano +' de dano, e foi um ataque crítico.', usuario);

        }else{
        embed = createEmbed(`Ataque de ${interaction.user.username}`, 'Você atacou com sucesso o usuário, dando ' + dano + ' de dano.', usuario);
    }
        await interaction.editReply({content: '', embeds: [embed], ephemeral: true });

        try {
            await usuario.send(`Você foi atacado por ${interaction.user.username} em <#${interaction.channel.id}>.`);
        } catch (e) {}
    }

    await db.update({ user: user.user }, user, 'user');
    await db.update({ user: userAtacado.user }, userAtacado, 'user');
}

module.exports = command;
