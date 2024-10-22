const { ApplicationCommandOptionType } = require("discord.js");

const commands = {
    name: 'ataques',
    description: 'Lista com todos ataques!',
    options: [
        {
            name: 'classe',
            description: 'Tipo de ataque que deseja buscar',
            type: ApplicationCommandOptionType.Number,
            required: true,
            choices: [
                {
                    name: 'Físico',
                    value: 1
                },
                {
                    name: 'Mágico',
                    value: 2
                },
                {
                    name: 'Inata',
                    value: 3
                }
            ]
        }
    ]
};

module.exports = commands;