
function findAtaque(id, type){
    var ataques = require('./ataques');
    if(type == 'magicos'){
        ataques = require('./magicas');
    }
    if(type == 'inatas'){
        const clas = require('./clas');
        ataques = []
        clas.forEach( cla => {
            cla.ataques.forEach( ataque => {
                ataques.push({
                    name: ataque.name,
                    description: ataque.description,
                    dmgBase: ataque.dmgBase,
                    level: ataque.level,
                    id: ataque.id,
                    rating: ataque.rating,
                    energia: ataque.mana,
                    cla: ataque.cla
                })
            })
        })
    }
    const ataque = ataques.find( ataque => ataque.id == id);
    return ataque ? ataque : false;
}

module.exports = findAtaque;