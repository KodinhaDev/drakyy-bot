
function findAtaque(id, type){
    var ataques = require('./ataques');
    if(type == 'magicos'){
        ataques = require('./magicas');
    }
    const ataque = ataques.find( ataque => ataque.id == id);
    return ataque ? ataque : false;
}

module.exports = findAtaque;