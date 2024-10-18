console.clear()
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const express = require('express');
const app = express();
require('./middleware/loadCommands');
const newuser = require('./middleware/newUser');
const descanso = require('./middleware/userDescanso');
const userXp = require('./middleware/userXp');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: ['CHANNEL']
});

client.once('ready', () => {
    console.log(`🍿 | Bot carregado como: ${client.user.tag}`);
});




client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    await interaction.reply({content: 'Processando comando...', ephemeral: false});
    const user = await newuser(interaction.user.id);
    const file = interaction.commandName + '.js';
    try {
        const func = require(`./handler/commands/${file}`)
        await func(interaction, user);
    } catch (e) {
        console.error(e)
        interaction.editReply('Erro interno. Erro reportado.')
    }
})




client.on('messageCreate', async (message) => {
    if(message.author.bot){
        return;
    }
    const user = await newuser(message.author.id);
    await descanso(client, user);
    await userXp(client, user);
})

client.login(process.env.TOKEN);
app.listen(6060, () => {
    console.log('🍿 | Porta aberta em 6060.');
})