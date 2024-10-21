const clas = require('../../middleware/items/clas');
const { EmbedBuilder } = require('discord.js');

async function command(interaction){
    const embed = new EmbedBuilder()
            .setColor('#2c3e50')
            .setTitle(`lista com todas inatas e clãs, ${interaction.user.username}!`)
            .setFooter({ text: `Comando requisitado por ${interaction.user.username}` })
            .setTimestamp()
            .setDescription('Para usar algum ataque dê /atacar inata {ataque}, caso você tenha o ataque.')
            .setThumbnail(interaction.user.avatarURL());

                clas.forEach(cla => {
                    embed.addFields({name: `Clã ${cla.name}: ${100 - cla.rating}/100 `, value: 'Aqui estão todos ataques do clã.'})
                    cla.ataques.forEach(ataque => {
                        embed.addFields({name: `${ataque.name}: ${ataque.dmgBase}, ${ataque.rating}% de acerto.`, value: `${ataque.description} libera no level ${ataque.level} de inata, e gasta ${ataque.mana} de energia amaldiçoada.`})
                    })
                    
                })


                await interaction.editReply({content: '', embeds: [embed]})
}

module.exports = command;