const items = [
    {
        name: 'Katana',
        description: 'Uma arma branca usada para combate.',
        value: 400,
        dmg: 30,
        life: false,
        type: 'atack',
        id: 1
    },
    {
        name: 'Soco inglês',
        description: 'Usado como arma em combates.',
        value: 250,
        dmg: 20,
        life: false,
        type: 'atack',
        id: 2
    },
    {
        name: 'Dedo do Sukuna',
        description: 'Um dos dedos do rei das maldições Sukuna.',
        value: false,
        dmg: false,
        use: true,
        id: 3
    },
    {
        name: 'Kit primeiros socorros',
        description: 'Um kit para curar sua vida por completa, gasta um turno.',
        value: 200,
        dmg: false,
        use: true,
        id: 4
    }
];

module.exports = items;
