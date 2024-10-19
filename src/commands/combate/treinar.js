const { ApplicationCommandOptionType } = require("discord.js");

const commands = {
    name: 'treinar',
    description: 'Treine para aumentar sua força.',
    options: [
        {
            name: 'tipo',
            description: 'Tipo de treino',
            type: ApplicationCommandOptionType.Number,
            required: false,
            choices: [
                {
                    name: 'Resistência',
                    value: 1
                },
                {
                    name: 'Força',
                    value: 2
                },
                {
                    name: 'Meditação',
                    value: 3
                }
            ]
        },
        {
            name: 'tempo',
            description: 'Tempo de treinamento',
            type: ApplicationCommandOptionType.Number,
            required: false,
            choices: [
                {
                    name: '1h',
                    value: 1
                },
                {
                    name: '3h',
                    value: 3
                },
                {
                    name: '5h',
                    value: 5
                }
            ]
        }
    ]
};

module.exports = commands;