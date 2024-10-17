const Database = require('../../middleware/database');
const db = new Database(process.env.MONGO);
const ataqueFind = require('../../middleware/items/ataqueController');
const newuser = require('../../middleware/newUser');

async function command(interaction, user){
    const usuario = interaction.options.getUser('user');
    await newuser(usuario.id);
    const ataqueId = interaction.options.getNumber('ataque');
    const ataque = ataqueFind(ataqueId);
    
    var dano = ataque.dmgBase * ( 1 + (user.forca / 100));
    await db.connect();
    const userAtacado = await db.find({user: usuario.id}, 'user')
    userAtacado.life -= dano;
    if(!user.turno){
        return interaction.reply('Você já deu seu ataque, espere ser atacado para atacar novamente.');
    }
    if(userAtacado.life <= 0){
        userAtacado.life = 0;
        userAtacado.turno = true;
        user.turno = false;
            interaction.reply(`O usuário <@${userAtacado.user}> foi morto por <@${user.user}> usando um ${ataque.name}.`);
    }else{
            interaction.reply({content: `Você atacou com sucesso o usuário.`, ephemeral: true});
            try{
                await usuario.send(`Você foi atacado por ${interaction.user.username} em <#${interaction.channel.id}>.`)
            }catch(e){
            }
    }
    await db.update({user: user.user}, user, 'user');
    await db.update({user: userAtacado.user}, userAtacado, 'user');
    await db.end();
}

module.exports = command;