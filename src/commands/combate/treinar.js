const { ApplicationCommandOptionType } = require("discord.js");

const commands = {
    name: 'treinar',
    description: 'Treine para aumentar sua força.',
    options: [
        {
            name: 'tipo',
            description: 'Tipo de treino',
            type: ApplicationCommandOptionType.Number,
            required: true,
            choises: [
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
            required: true,
            choises: [
                {
                    name: '1h',
                    value: 1
                },
                {
                    name: '3h',
                    value: 2
                },
                {
                    name: '5h',
                    value: 3
                }
            ]
        }
    ]
};

module.exports = commands;