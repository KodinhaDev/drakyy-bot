const { EmbedBuilder } = require('discord.js');
const path = require('path')
const loadCommands = require('../../commands/index');
const commandsDir = path.resolve(__dirname, '../../commands');
const commands = loadCommands(commandsDir)

async function command(interaction, user) {
    let description = '';
    commands.forEach(cmd => {
        description += `**/${cmd.name}** - ${cmd.description}\n`;
    });


    const embed = new EmbedBuilder()
        .setColor('#2c3e50') 
        .setTitle('Lista de Comandos Disponíveis') 
        .setDescription(description) 
        .setTimestamp(); 

    if (user) {
        embed.setFooter({ text: `Comando requisitado por ${interaction.user.username}` });
    }

    await interaction.editReply({content: '', embeds: [embed] });
}

module.exports = command;
