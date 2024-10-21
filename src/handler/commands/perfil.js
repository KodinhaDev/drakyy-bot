const { EmbedBuilder } = require('discord.js');
const db = require('../../middleware/database');
const newuser = require('../../middleware/newUser');
const levels = require('../../middleware/items/levels');
const clas = require('../../middleware/items/clas');

async function command(interaction, user) {
    const usuario = interaction.options.getUser('usuario');
    try {
        await newuser(usuario.id);
    } catch (e) {
    }
    const reqPor = interaction.user.username
    if (usuario != null) {
        user = await db.find({ user: usuario.id }, 'user');
        interaction.user = usuario;
    }
    const cla = clas.find(cla => cla.id == user.cla.cla);
    const level = levels.find(level => level.level == user.level)
    const levelInata = levels.find(level => level.level == user.levelMagico)
    const embed = new EmbedBuilder()
        .setColor('#2c3e50')
        .setTitle(`Perfil de ${interaction.user.username}`)
        .setDescription(`Aqui estão as informações de ${interaction.user.username}!`)
        .addFields(
            { name: '💰 | Ouro', value: `${user.money}`, inline: true },
            { name: '🪄 | Energia Amaldiçoada', value: `${user.energia} / ${user.energiaMax}`, inline: true },
            { name: '⭐ | Level', value: `${user.level}`, inline: true },
            { name: ' 🎯  | Xp', value: `${user.xp} / ${level.xp}`, inline: true },
            { name: '✨ | Level de inata', value: `${user.levelMagico}`, inline: true },
            { name: '🔮 | Xp de inata', value: `${user.xpMagico} / ${levelInata.xp}`, inline: true },
            { name: '❤️ | Vida', value: user.life <= 0 ? 'Desmaiado' : `${user.life} / ${user.maxLife}`, inline: true },
            { name: '💪 | Força', value: `${user.forca}`, inline: true },
            { name: '⛩️ | Clã', value: `${cla != undefined ? cla.name : 'Sem clã.'}`, inline: true },
        )
        .setThumbnail(interaction.user.avatarURL())
        .setFooter({ text: `Comando requisitado por ${reqPor}` })
        .setTimestamp();

    interaction.editReply({ content: '', embeds: [embed], ephermal: false });
}

module.exports = command;
