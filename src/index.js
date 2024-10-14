console.clear()
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
require('./middleware/loadCommands');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
    console.log(`🍿 | Bot carregado como: ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    const file = interaction.commandName + '.js';
    const func = require(`./handler/commands/${file}`)
    await func(interaction);
})

client.login(process.env.TOKEN);