const { ApplicationCommandOptionType } = require("discord.js");

const commands = {
    name: 'pay',
    description: 'Pague um usuário!',
    options: [
        {
            name: 'usuario',
            description: 'Destinatário do pagamento.',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'quantia',
            description: 'Quantidade a ser paga.',
            type: ApplicationCommandOptionType.Number,
            required: true
        }
    ]
};

module.exports = commands;