const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const items = require('../../middleware/items/items');
const choices = [];
items.forEach(item => {
    if(!item.value) return;
    choices.push({ name: item.name, value: `${item.id}` });
});

const commands = {
    name: 'comprar',
    description: 'Permite que o usuário compre itens da loja.',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'item',
            description: 'Escolha um item para comprar',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: choices
        },
        {
            name: 'quantidade',
            description: 'Quantidade de items que deseja comprar',
            type: ApplicationCommandOptionType.Number,
            required: false
        }
    ]
};

module.exports = commands;
