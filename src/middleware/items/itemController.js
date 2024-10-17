const items = require('./items');

function findItem(id) {
    const item = items.find(item => item.id === id);
    return item ? item : false;
}

module.exports = findItem;