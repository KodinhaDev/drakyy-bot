// const { ApplicationCommandOptionType } = require('discord.js');
// var items = require('../../middleware/items/items');
// items = items.map(item => ({
//     name: item.name,
//     value: item.id 
// }));

// const commands = {
//     name: 'trade',
//     description: 'Troca items ou dinheiro com outro player.',
//     options: [
//         {
//             name: 'user',
//             description: 'Seleciona o jogador com o qual deseja trocar.',
//             type: ApplicationCommandOptionType.Subcommand, 
//             options: [
//                 {
//                     name: 'player',
//                     description: 'Player com o qual deseja trocar.',
//                     type: ApplicationCommandOptionType.User,
//                     required: true
//                 }
//             ]
//         },
//         {
//             name: 'accept',
//             description: 'Tem certeza que deseja aceitar esta trade?',
//             type: ApplicationCommandOptionType.Subcommand,
//         },
//         {
//             name: 'cancel',
//             description: 'Cancelar a trade',
//             type: ApplicationCommandOptionType.Subcommand,
//         },
//         {
//             name: 'info',
//             description: 'Cancelar a trade',
//             type: ApplicationCommandOptionType.Subcommand,
//         },
//         {
//             name: 'add',
//             description: 'Adicionar um item ou dinheiro à troca.',
//             type: ApplicationCommandOptionType.SubcommandGroup, 
//             options: [
//                 {
//                     name: 'item',
//                     description: 'Adicionar um item à troca.',
//                     type: ApplicationCommandOptionType.Subcommand,
//                     options: [
//                         {
//                             name: 'item',
//                             description: 'Selecione o item para adicionar.',
//                             type: ApplicationCommandOptionType.Number,
//                             choices: items, 
//                             required: true
//                         }
//                     ]
//                 },
//                 {
//                     name: 'money',
//                     description: 'Adicionar dinheiro à troca.',
//                     type: ApplicationCommandOptionType.Subcommand,
//                     options: [
//                         {
//                             name: 'quantia',
//                             description: 'Quantia de dinheiro a adicionar.',
//                             type: ApplicationCommandOptionType.Number,
//                             required: true
//                         }
//                     ]
//                 }
//             ]
//         }
//     ]
// };

// module.exports = commands;
