const { ApplicationCommandOptionType } = require('discord.js');
const ataques = require('../../middleware/items/ataques');

const options = ataques.map(ataque => ({
    name: ataque.name,
    value: ataque.id 
}));

const commands = {
    name: 'atacar',
    description: 'Atacar algum player.',
    options: [
        {
            name: 'ataque',
            description: 'Escolha o ataque que deseja usar.',
            type: ApplicationCommandOptionType.Number, 
            required: true,
            choices: options
        },
        {
            name: 'user',
            description: 'Usuário a ser atacado.',
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],
};


module.exports = commands;
