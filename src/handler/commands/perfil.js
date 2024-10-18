const { EmbedBuilder } = require('discord.js');
const db = require('../../middleware/database');
// const db = new Database(process.env.MONGO);
const newuser = require('../../middleware/newUser');

async function command(interaction, user) {
    const usuario = interaction.options.getUser('usuario');
    try{
        await newuser(usuario.id);
    }catch(e){
    }
    if(usuario != null){
        user = await db.find({user: usuario.id}, 'user');
        interaction.user = usuario;
    }
    const embed = new EmbedBuilder()
        .setColor('#2c3e50') 
        .setTitle(`Perfil de ${interaction.user.username}`)
        .setDescription(`Aqui estão suas informações, ${interaction.user.username}!`)
        .addFields(
            { name: '💰 | Ouro', value: `${user.money}`, inline: true },
            { name: '🪄 | Mana', value: `${user.mana}`, inline: true },
            { name: '⭐ | Level', value: `${user.level}`, inline: true },
            { name: '🎯 | Xp', value: `${user.xp}`, inline: true },
            { name: '❤️ | Vida', value: user.life <= 0 ? 'Desmaiado' : `${user.life} / ${user.maxLife}`, inline: true },
            { name: '💪 | Força', value: `${user.forca}`, inline: true },
            { name: '🏃‍♂️ | Velocidade', value: `${user.velocidade}`, inline: true },
        )
        .setThumbnail(interaction.user.avatarURL()) 
        .setFooter({ text: `Comando requisitado por ${interaction.user.username}` })
        .setTimestamp(); 

    interaction.editReply({content: '', embeds: [embed], ephermal: false });
}

module.exports = command;
