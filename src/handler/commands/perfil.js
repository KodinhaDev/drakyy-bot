const { EmbedBuilder } = require('discord.js');
const db = require('../../middleware/database');
// const db = new Database(process.env.MONGO);
const newuser = require('../../middleware/newUser');
const levels = require('../../middleware/items/levels');
var levelMax = levels.length;
levelMax -= 2;

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
    const embed = new EmbedBuilder()
        .setColor('#2c3e50')
        .setTitle(`Perfil de ${interaction.user.username}`)
        .setDescription(`Aqui estão as informações de ${interaction.user.username}!`)
        .addFields(
            { name: '💰 | Ouro', value: `${user.money}`, inline: true },
            { name: '🪄 | Energia Amaldiçoada', value: `${user.energia}`, inline: true },
            { name: '⭐ | Level', value: `${user.level}`, inline: true },
            { name: ' 🎯  | Xp', value: `${user.xp}`, inline: true },
            { name: '✨ | Level Mágico', value: `${user.levelMagico}`, inline: true },
            { name: '🔮 | Xp Mágico', value: `${user.xpMagico}`, inline: true },
            { name: '❤️ | Vida', value: user.life <= 0 ? 'Desmaiado' : `${user.life} / ${user.maxLife}`, inline: true },
            { name: '💪 | Força', value: `${user.forca}`, inline: true },
        )
        .setThumbnail(interaction.user.avatarURL())
        .setFooter({ text: `Comando requisitado por ${reqPor}` })
        .setTimestamp();

    interaction.editReply({ content: '', embeds: [embed], ephermal: false });
}

module.exports = command;
