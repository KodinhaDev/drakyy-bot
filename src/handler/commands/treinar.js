const db = require('../../middleware/database');
const { EmbedBuilder } = require('discord.js');
const embedConstructor = require('../../middleware/generateEmbed');

async function command(interaction, user) {
    if(user.desmaio.desmaiado == true){
        return interaction.editReply({ content: '', embeds: [ await embedConstructor('Aviso', 'Você não pode iniciar um treinamento pois está desmaiado.', interaction.user)]});
    }
    const tipo = interaction.options.getNumber('tipo');
    const tempo = interaction.options.getNumber('tempo');

    // Validação de entrada
    if (tipo == null && tempo != null) return sendEmbed2(interaction.user);
    if (tipo != null && tempo == null) return sendEmbed2(interaction.user);
    
    // Se o tipo e tempo forem nulos
    if (tipo == null && tempo == null) {
        if (user.treinamento.emTreino) {
            return sendEmbed(interaction.user, user.treinamento.terminoTreino, user.treinamento.tipo); // Envio de informações sobre o treino em andamento
        } else {
            return sendEmbed2(interaction.user); // Falta de informações
        }
    }

    // Calcular data de término
    let dataTermino;
    if (tempo === 1) dataTermino = Date.now() + (1 * 60 * 60 * 1000);
    if (tempo === 3) dataTermino = Date.now() + (3 * 60 * 60 * 1000);
    if (tempo === 5) dataTermino = Date.now() + (5 * 60 * 60 * 1000);

    // Iniciar treinamento
    if (!user.treinamento.emTreino) {
        user.treinamento.emTreino = true;
        user.treinamento.terminoTreino = dataTermino;
        user.treinamento.tipo = tipo;
        user.treinamento.tempo = tempo;
        
        await db.update({ user: user.user }, user, 'user'); // Atualiza o banco de dados
        return sendEmbed3(interaction.user); // Enviar confirmação de início do treinamento
    } else {
        return sendEmbed(interaction.user, user.treinamento.terminoTreino, user.treinamento.tipo); // Envio de informações sobre o treino em andamento
    }

    // Função para enviar informações sobre o treinamento em andamento
    async function sendEmbed(user, milissegundos, tipo) {
        const tempoRestante = new Date(milissegundos);
        const agora = Date.now();
        const restante = tempoRestante - agora;

        // Cálculo do tempo restante
        const horasRestantes = Math.floor((restante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutosRestantes = Math.floor((restante % (1000 * 60 * 60)) / (1000 * 60));

        const embed = new EmbedBuilder()
            .setColor('#2c3e50')
            .setTitle('Treinando')
            .setDescription(`Você ainda está treinando ${tipo === 1 ? 'resistência' : ''}${tipo === 2 ? 'força' : ''}${tipo === 3 ? 'meditação' : ''}, em ${horasRestantes} horas e ${minutosRestantes} minutos ele terminará.`)
            .setFooter({ text: `Comando requisitado por ${user.username}` })
            .setTimestamp()
            .setThumbnail(user.avatarURL());
        
        await interaction.editReply({ content: '', embeds: [embed] });
    }

    // Função para enviar mensagem de erro
    async function sendEmbed2(user) {
        const embed = new EmbedBuilder()
            .setColor('#2c3e50')
            .setTitle('Erro')
            .setDescription(`No seu comando falta alguns requisitos como tempo de treino ou tipo de treino.`)
            .setFooter({ text: `Comando requisitado por ${user.username}` })
            .setTimestamp()
            .setThumbnail(user.avatarURL());

        await interaction.editReply({ content: '', embeds: [embed] });
    }

    // Função para enviar confirmação de início do treinamento
    async function sendEmbed3(user) {
        const embed = new EmbedBuilder()
            .setColor('#2c3e50')
            .setTitle('Treinamento iniciado')
            .setDescription(`Seu treinamento de ${tipo === 1 ? 'resistência' : ''}${tipo === 2 ? 'força' : ''}${tipo === 3 ? 'meditação' : ''} terminará em ${tempo === 1 ? '1 Hora.' : ''}${tempo === 3 ? '3 Horas.' : ''}${tempo === 5 ? '5 horas.' : ''}`)
            .setFooter({ text: `Comando requisitado por ${user.username}` })
            .setTimestamp()
            .setThumbnail(user.avatarURL());

        await interaction.editReply({ content: '', embeds: [embed] });
    }
}

module.exports = command;

