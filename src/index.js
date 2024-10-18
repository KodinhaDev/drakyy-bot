console.clear()
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const express = require('express');
const app = express();
require('./middleware/loadCommands');
const newuser = require('./middleware/newUser');

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
    const user = await newuser(interaction.user.id);
    if (!interaction.isCommand()) return;
    const file = interaction.commandName + '.js';
    try {
        const func = require(`./handler/commands/${file}`)
        await func(interaction, user);
    } catch (e) {
        console.error(e)
        interaction.reply('Erro interno. Erro reportado.')
    }

})




client.on('messageCreate', async (message) => {
    if(message.author.bot){
        return;
    }
    await newuser(message.author.id);
})

client.login(process.env.TOKEN);
app.listen(6060, () => {
    console.log('🍿 | Porta aberta em 6060.');
})