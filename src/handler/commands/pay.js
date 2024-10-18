const Database = require('../../middleware/database');
const db = new Database(process.env.MONGO);
const newuser = require('../../middleware/newUser');

async function command(interaction, user) {
    const usuario = interaction.options.getUser('usuario');
    try{
        await newuser(usuario.id);
    }catch(e){
    }
    const quantia = interaction.options.getNumber('quantia');
    if(interaction.user.id == usuario.id) return interaction.editReply({ content: 'Você não pode enviar dinheiro para si mesmo.', ephemeral: true });
    await db.connect();

    const destinatario = await db.find({ user: usuario.id }, 'user');
    if(user.money < quantia || quantia < 0) return interaction.editReply({ content: 'Você não tem dinheiro suficiente para enviar esta quantia.', ephemeral: true });
    if (destinatario) {
        destinatario.money += quantia;
        user.money -= quantia;
        await db.update({ user: destinatario.user }, destinatario, 'user');
        await db.update({ user: user.user }, user, 'user');

        try {
            await usuario.send(`Você recebeu um pagamento de ${interaction.user.username} no valor de ${quantia}R$, no canal <#${interaction.channel.id}>!`)
        } catch (e) {
        }
        return interaction.editReply({ content: 'Pagamento realizado com sucesso.', ephemeral: true });
    } else {
        return interaction.editReply({ content: 'Usuário não encontrado no nosso database.', ephemeral: true });
    }

}

module.exports = command;