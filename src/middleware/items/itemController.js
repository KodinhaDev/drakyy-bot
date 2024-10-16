const items = require('./items');

function findItem(id) {
    const item = items.find(item => item.id === id);
    return item ? { name: item.name, description: item.description, life: item.life, dmg: item.dmg } : false;
}

module.exports = findItem;