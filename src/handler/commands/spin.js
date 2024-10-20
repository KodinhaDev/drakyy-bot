const db = require('../../middleware/database');
const embedConstructor = require('../../middleware/generateEmbed');
const cla = require('../../middleware/items/clas');

async function command(interaction, user){
    if(user.cla.spins >= 1){
        const chance = Math.floor(Math.random() * 101);
        user.cla.spins -= 1;
        var cla2 = undefined;
        cla.forEach(cla => {
            if(cla.rating < chance){
                user.cla.cla = cla.id;
                cla2 = cla.name;
                return;
            }
        })
        if(cla2 != undefined){
            interaction.editReply({content: '', embeds: [await embedConstructor('Parabéns!', `Você girou e conseguiu pegar a família ${cla2}.`, interaction.user)]})
        }else{
            interaction.editReply({content: '', embeds: [await embedConstructor('Azar!', 'Infelizmente, você não conseguiu ganhar nenhuma família nova.')]})
        }
        await db.update({user: user.user}, user, 'user');
    }else{
        interaction.editReply({content: '', embeds: [await embedConstructor('Erro', 'Você não tem spins o suficiente para utilizar este comando.', interaction.user)]})
    }
}

module.exports = command;