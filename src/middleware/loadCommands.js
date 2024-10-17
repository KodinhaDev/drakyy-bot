const { REST, Routes } = require('discord.js');
const rest = new REST().setToken(process.env.TOKEN);
const path = require('path');
const loadCommands = require('../commands/index');

const commandsDir = path.resolve(__dirname, '../commands');
const commands = loadCommands(commandsDir);

(async () => {
	try {
		console.log(`⏳  | Tentando iniciar ${commands.length} slash commands.`);

		const data = await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commands },
		);

		console.log(`🔄 | Foram iniciados ${data.length} slash commands.`);
	} catch (error) {
		console.error(error);
	}
})();