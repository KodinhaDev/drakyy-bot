const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
require('./middleware/loadCommands');
const ocupado = require('./middleware/ocupado');
const middlewares = require('./middleware/index');

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
    console.log(`🏰 | Online em ${client.guilds.cache.size} servidores!`);
});




client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    try {
        await interaction.reply({ content: 'Processando comando...', ephemeral: false });
    } catch (e) {
    }
    const file = interaction.commandName + '.js';
    const user = await middlewares(client, interaction.user.id);
    const ocupad = await ocupado(interaction, user);
    if (ocupad == true && interaction.commandName != 'descansar' && interaction.commandName != 'treinar' && interaction.commandName != 'perfil') return;
    try {
        const func = require(`./handler/commands/${file}`)
        await func(interaction, user);
    } catch (e) {
        console.error(e)
        interaction.editReply('Erro interno, logs reportadas.')
    }
})




client.on('messageCreate', async (message) => {
    if (message.author.bot) {
        return;
    }
    middlewares(client, message.author.id);
})

client.login(process.env.TOKEN);