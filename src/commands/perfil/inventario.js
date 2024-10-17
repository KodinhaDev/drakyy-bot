const { ApplicationCommandOptionType } = require("discord.js");

const commands = {
    name: 'inventario',
    description: 'Exibe o inventario do usuário!',
    options: [
        {
            name: 'usuario',
            description: 'Caso deseja ver o inventario de outro usuario.',
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ]
};

module.exports = commands;