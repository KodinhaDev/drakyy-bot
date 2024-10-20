
const clas = [
    {
        name: 'Gojo',
        id: 1,
        description: '',
        rating: 99,
        ataques: [
            {
                name: 'Blue',
                description: 'Atrai seu oponente para você.',
                dmgBase: 200,
                mana: 100,
                rating: 100,
                level: 5,
                id: 1,
                cla: 1
            },
            {
                name: 'Red',
                description: 'Repele tudo o que toca.',
                dmgBase: 350,
                mana: 200,
                rating: 100,
                level: 10,
                id: 2,
                cla: 1
            },
            {
                name: 'Purple Void',
                description: 'Atrai e repele tudo, apagando o oponente.',
                dmgBase: 500,
                mana: 400,
                rating: 100,
                level: 20,
                id: 3,
                cla: 1
            }
        ]
    },
    {
        name: 'Zenin',
        id: 2,
        description: '',
        rating: 98,
        ataques: [
            {
                name: 'Divine dogs',
                description: 'Dois cães que atacam seu oponente.',
                dmgBase: 80,
                mana: 300,
                rating: 85,
                level: 5,
                id: 4,
                cla: 2
            },
            {
                name: 'Nue',
                description: 'Uma coruja que taca raios elétricos.',
                dmgBase: 140,
                mana: 200,
                rating: 90,
                level: 10,
                id: 5,
                cla: 2
            },
            {
                name: 'Bansho',
                description: 'Um elefante cai do céu na cabeça do inimigo',
                dmgBase: 200,
                mana: 400,
                rating: 95,
                level: 20,
                id: 6,
                cla: 2
            },
        ]
    }
]

module.exports = clas;