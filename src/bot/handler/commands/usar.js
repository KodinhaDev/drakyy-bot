async function command(interaction, user){
    const itemId = interaction.options.getNumber('item');
    const func = require(`./useFunctions/item${itemId}.js`);
    func(interaction, user);
}

module.exports = command;