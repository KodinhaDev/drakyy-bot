const ataques = require('./ataques');

function findAtaque(id){
    const ataque = ataques.find( ataque => ataque.id == id);
    return ataque ? ataque : false;
}

module.exports = findAtaque;