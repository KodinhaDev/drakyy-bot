const { ApplicationCommandOptionType } = require('discord.js');
const fisicos = require('../../middleware/items/ataques');
const magicos = require('../../middleware/items/magicas');
const clas = require('../../middleware/items/clas');

const ataqueFisicoChoices = fisicos.map(ataque => ({
    name: ataque.name,
    value: ataque.id 
}));

const ataqueMagicoChoices = magicos.map(ataque => ({
    name: ataque.name,
    value: ataque.id 
}));
const ataqueInatasChoices = clas.flatMap(classe => 
    classe.ataques.map(ataque => ({
        name: ataque.name,
        value: ataque.id
    }))
);

const commands = {
    name: 'atacar',
    description: 'Atacar algum player.',
    options: [
        {
            name: 'classe',
            description: 'Escolha a classe que deseja de ataques',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'fisicos',
                    description: 'Ataques físicos',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'ataque',
                            description: 'Escolha o ataque físico que deseja usar.',
                            type: ApplicationCommandOptionType.Number, 
                            required: true,
                            choices: ataqueFisicoChoices
                        },
                        {
                            name: 'user',
                            description: 'Usuário a ser atacado.',
                            type: ApplicationCommandOptionType.User,
                            required: true
                        }
                    ]
                },
                {
                    name: 'magicos',
                    description: 'Ataques mágicos',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'ataque',
                            description: 'Escolha o ataque mágico que deseja usar.',
                            type: ApplicationCommandOptionType.Number,
                            required: true,
                            choices: ataqueMagicoChoices
                        },
                        {
                            name: 'user',
                            description: 'Usuário a ser atacado.',
                            type: ApplicationCommandOptionType.User,
                            required: true
                        }
                    ]
                },
                {
                    name: 'inatas',
                    description: 'Ataques do seu clã',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'ataque',
                            description: 'Escolha o ataque mágico que deseja usar.',
                            type: ApplicationCommandOptionType.Number,
                            required: true,
                            choices: ataqueInatasChoices
                        },
                        {
                            name: 'user',
                            description: 'Usuário a ser atacado.',
                            type: ApplicationCommandOptionType.User,
                            required: true
                        }
                    ]
                }
            ]
        }
    ],
};

module.exports = commands;
