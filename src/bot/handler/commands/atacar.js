const db = require('../../middleware/database');
const ataqueFind = require('../../middleware/items/ataqueController');
const newuser = require('../../middleware/newUser');
const embedConstructor = require('../../middleware/generateEmbed');
const { EmbedBuilder } = require('discord.js');

function createEmbed(title, description, user) {
    const color = '#2c3e50'
    return new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(description)
        .setFooter({ text: `Comando requisitado por ${user.username}` })
        .setTimestamp()
        .setThumbnail(user.avatarURL());
}

async function command(interaction, user) {
    const classe = interaction.options.getSubcommand();
    const usuario = await interaction.options.getUser('user');

    if(usuario.bot){
        return await interaction.editReply({ content: '', embeds: [createEmbed('Erro', 'Você não pode atacar bots.', interaction.user)] })
    }

    if (usuario.id == user.user) {
        return await interaction.editReply({ content: '', embeds: [createEmbed('Erro', 'Você não pode se auto-atacar.', interaction.user)] })
    }

    try {
        await newuser(usuario.id);
    } catch (e) { }

    const ataqueId = await interaction.options.getNumber('ataque');
    const ataque = ataqueFind(ataqueId, classe);
    var dano
    if (classe == 'magicos') {

        if (ataque.level > user.levelMagico) {
            return await interaction.editReply({ content: '', embeds: [createEmbed('Erro', `Você não pode usar ${ataque.name.toLowerCase()}, pois para usar ele precisa ser level ${ataque.level} em inata ou superior.`, interaction.user)] })
        }

        dano = Math.floor(ataque.dmgBase * (1 + (user.forca / 70) + (user.levelMagico / 30)));
        user.energia -= ataque.energia;

        if(user.energia < 0){
            return await interaction.editReply({ content: '', embeds: [createEmbed('Erro', `Você não pode usar ${ataque.name.toLowerCase()}, pois para usar ele precisa de ${ataque.energia} energia amaldiçoada para usar.`, interaction.user)] })
        }


    }else if(classe == 'inatas'){

        if(ataque.level > user.levelMagico){
            return await interaction.editReply({content: '', embeds: [await embedConstructor('Erro', `Você não pode usar ${ataque.name.toLowerCase()}, pois para usar este ataque é necessário ter level ${ataque.level} em inata ou superior.`, interaction.user)]})
        }

        dano = Math.floor(ataque.dmgBase * (1 + (user.forca / 120) + (user.levelMagico / 50)));
        user.energia -= ataque.energia;

        if(user.energia < 0){
            return await interaction.editReply({ content: '', embeds: [createEmbed('Erro', `Você não pode usar ${ataque.name.toLowerCase()}, pois para usar ele precisa de ${ataque.energia} energia amaldiçoada para usar.`, interaction.user)] })
        }

        if(user.cla.cla == null || ataque.cla != user.cla){
            return await interaction.editReply({content: '', embeds: [await embedConstructor('Erro', `Você não faz parte deste clã para usar este poder.`, interaction.user)]})
        }

    }else {

        if (ataque.level > user.level) {
            return await interaction.editReply({ content: '', embeds: [createEmbed('Erro', `Você não pode usar ${ataque.name.toLowerCase()}, pois para usar ele precisa ser level ${ataque.level} ou superior.`, interaction.user)] })
        }

        dano = Math.floor(ataque.dmgBase * (1 + (user.forca / 70) + (user.level / 30)));

    }

    const userAtacado = await db.find({ user: usuario.id }, 'user');

    if (userAtacado.afk == true || user.afk == true) {
        return await interaction.editReply({ content: '', embeds: [createEmbed('Erro', 'Algum de vocês dois estão afk, não podem se atacar.', interaction.user)] })
    }

    if (userAtacado.life <= 0 || userAtacado.treinamento.emTreino) {
        const embed = createEmbed(`Ação com ${usuario.username}`, 'Este usuário está ocupado, e não pode lutar.', interaction.user);
        return await interaction.editReply({ content: '', embeds: [embed], ephemeral: true });
    }
    if (user.life <= 0 || user.treinamento.emTreino) {
        const embed = createEmbed(`Ação com ${usuario.username}`, 'Você está ocupado, e não pode lutar.', interaction.user);
        return await interaction.editReply({ content: '', embeds: [embed], ephemeral: true });
    }

    if (user.turno === false) {
        const embed = createEmbed(`Ação com ${usuario.username}`, 'Você já deu seu ataque, espere ser atacado para atacar novamente.', interaction.user);
        return await interaction.editReply({ content: '', embeds: [embed], ephemeral: true });
    }

    const chance = Math.floor(Math.random() * 101);
    if (chance > ataque.rating) {
        userAtacado.turno = true;
        user.turno = false;
        user.lastTurno = Date.now() + 15 * 60 * 1000;
        await db.update({ user: user.user }, user, 'user');
        await db.update({ user: userAtacado.user }, userAtacado, 'user');
        return await interaction.editReply({
            content: '',
            embeds: [createEmbed(`Aviso!`, usuario.username + ' conseguiu defender, e você perdeu o turno, ' + interaction.user.username + '.', interaction.user)]
        });
    }
    var critico = false;
    if (chance >= 80) {
        dano *= 3;
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
        user.lastTurno = Date.now() + 15 * 60 * 1000;
        user.xp += dano + 50;
        let embed
        if (critico) {
            embed = createEmbed(`${usuario.username} perdeu.`, `O usuário <@${userAtacado.user}> foi desmaiado por <@${user.user}>, usando ${ataque.name}, após um ataque crítico, que deu ${dano} de dano.`, interaction.user);
        } else {
            embed = createEmbed(`${usuario.username} perdeu.`, `O usuário <@${userAtacado.user}> foi desmaiado por <@${user.user}>, usando ${ataque.name}, que deu ${dano} de dano.`, interaction.user);
        }
        await interaction.editReply({ content: '', embeds: [embed], ephemeral: false });
    } else {
        userAtacado.turno = true;
        user.turno = false;
        user.lastTurno = Date.now() + 15 * 60 * 1000;
        user.xp += dano;
        let embed
        if (critico) {
            embed = createEmbed(`Aviso!`, `Você atacou com sucesso ${usuario.username}, dando um crítico que causou ` + dano + ' de dano.', interaction.user);

        } else {
            embed = createEmbed(`Aviso!`, `Você atacou com sucesso ${usuario.username}, dando ` + dano + ' de dano.', interaction.user);
        }
        await interaction.editReply({ content: '', embeds: [embed], ephemeral: true });

        try {
            await usuario.send({embeds: [await embedConstructor('Aviso!', `Você foi atacado por ${interaction.user.username} em <#${interaction.channel.id}>.`)]});
        } catch (e) {
            await interaction.channel.send({embeds: [await embedConstructor('Aviso!', `<@${usuario.id}>, você foi atacado por ${interaction.user.username}.`)]});
         }
    }

    await db.update({ user: user.user }, user, 'user');
    await db.update({ user: userAtacado.user }, userAtacado, 'user');
}

module.exports = command;
