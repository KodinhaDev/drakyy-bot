const { ApplicationCommandOptionType } = require("discord.js");

const commands = {
    name: 'perfil',
    description: 'Exibe o perfil do usuário!',
    options: [
        {
            name: 'usuario',
            description: 'Caso deseja ver o perfil de outro usuario.',
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ]
};

module.exports = commands;