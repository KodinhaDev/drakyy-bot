const { ApplicationCommandOptionType } = require("discord.js");
const items = require('../../middleware/items/items');
const choices = []; 

items.forEach(item => {
    if (!item.use) return; 
    choices.push({ name: item.name, value: item.id }); 
});




const commands = {
    name: 'usar',
    description: 'Treine para aumentar sua força.',
    options: [
        {
            name: 'item',
            description: 'Qual item deseja utilizar',
            type: ApplicationCommandOptionType.Number,
            required: true,
            choices: choices
        }
    ]
};

module.exports = commands;