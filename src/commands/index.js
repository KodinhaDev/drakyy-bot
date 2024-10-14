const fs = require('fs');
const path = require('path');

function loadCommands(dir) {
    const commands = [];
    const categories = fs.readdirSync(dir);

    for (const category of categories) {
        const categoryPath = path.join(dir, category);
        
        // Verificar se o caminho é um diretório antes de tentar ler os arquivos
        if (fs.lstatSync(categoryPath).isDirectory()) {
            const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const command = require(path.join(categoryPath, file));
                commands.push(command);
            }
        }
    }

    return commands;
}

module.exports = loadCommands;
