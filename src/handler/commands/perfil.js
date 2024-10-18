const { EmbedBuilder } = require('discord.js');
const Database = require('../../middleware/database');
const db = new Database(process.env.MONGO);
const newuser = require('../../middleware/newUser');

async function command(interaction, user) {
    const usuario = interaction.options.getUser('usuario');
    try{
        await newuser(usuario.id);
    }catch(e){
    }
    if(usuario != null){
        await db.connect();
        user = await db.find({user: usuario.id}, 'user');
        interaction.user = usuario;
        await db.end();
    }
    const embed = new EmbedBuilder()
        .setColor('#2c3e50') 
        .setTitle(`Perfil de ${interaction.user.username}`)
        .setDescription(`Aqui estão suas informações, ${interaction.user.username}!`)
        .addFields(
            { name: '💰 | Dinheiro', value: `${user.money}`, inline: true },
            { name: '🪄 | Mana', value: `${user.mana}`, inline: true },
            { name: '❤️ | Vida', value: user.life <= 0 ? 'Morto' : `${user.life}`, inline: true },
            { name: '💪 | Força', value: `${user.forca}`, inline: true },
            { name: '🏃‍♂️ | Velocidade', value: `${user.velocidade}`, inline: true },
            { name: '🌌 | Kokusens', value: `${user.kokusens}`, inline: true },
        )
        .setThumbnail(interaction.user.avatarURL()) 
        .setFooter({ text: `Comando requisitado por ${interaction.user.username}` })
        .setTimestamp(); 

    interaction.editReply({content: '', embeds: [embed] });
}

module.exports = command;
