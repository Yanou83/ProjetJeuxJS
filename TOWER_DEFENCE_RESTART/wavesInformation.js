// const wavesInformation = [
//     null, // Vague 0 n'existe pas
//     {
//         enemies: [
//             { type: 'basic', delay: 0 },
//             { type: 'basic', delay: 1000 },
//             { type: 'basic', delay: 1000 },
//             { type: 'basic', delay: 1000 },
//             { type: 'basic', delay: 1000 }
//         ],
//         reward: 15
//     },
//     {enemies: [
//             { type: 'basic', delay: 0 },
//             { type: 'basic', delay: 1000 },
//             { type: 'basic', delay: 1000 },
//             { type: 'basic', delay: 1000 },
//             { type: 'basic', delay: 1000 },
//             { type: 'basic', delay: 1000 },
//             { type: 'basic', delay: 1000 },
//             { type: 'basic', delay: 1000 },
//             { type: 'fast', delay: 3000 },
//             { type: 'fast', delay: 1000 },
//             { type: 'fast', delay: 1000 }
//         ],
//         reward: 20
//     },
// ];

const wavesInformation = [
    null, // Vague 0 n'existe pas
    {
        enemies: [
            { type: 'basic', delay: 0 },
            { type: 'basic', delay: 2000 },
            { type: 'basic', delay: 2000 },
            { type: 'basic', delay: 2000 },
            { type: 'basic', delay: 2000 }
        ],
        reward: 15
    },
    {
        enemies: [
            { type: 'basic', delay: 0 },
            { type: 'basic', delay: 1500 },
            { type: 'basic', delay: 1500 },
            { type: 'basic', delay: 1500 },
            { type: 'basic', delay: 1500 },
            { type: 'basic', delay: 1500 },
            { type: 'fast', delay: 3000 },
            { type: 'fast', delay: 2000 }
        ],
        reward: 20
    },
    {
        enemies: [
            { type: 'fast', delay: 0 },
            { type: 'fast', delay: 1500 },
            { type: 'fast', delay: 1500 },
            { type: 'fast', delay: 1500 },
            { type: 'basic', delay: 2000 },
            { type: 'basic', delay: 2000 },
            { type: 'basic', delay: 2000 }
        ],
        reward: 25
    },
    {
        enemies: [
            { type: 'tank', delay: 0 },
            { type: 'tank', delay: 2500 },
            { type: 'basic', delay: 1500 },
            { type: 'basic', delay: 1500 },
            { type: 'fast', delay: 2000 },
            { type: 'fast', delay: 2000 }
        ],
        reward: 30
    },
    {
        enemies: [
            { type: 'basic', delay: 0 },
            { type: 'basic', delay: 1500 },
            { type: 'fast', delay: 2000 },
            { type: 'fast', delay: 2000 },
            { type: 'tank', delay: 3000 },
            { type: 'tank', delay: 3000 }
        ],
        reward: 35
    },
    {
        enemies: [
            { type: 'fast', delay: 0 },
            { type: 'fast', delay: 1500 },
            { type: 'fast', delay: 1500 },
            { type: 'tank', delay: 2500 },
            { type: 'tank', delay: 2500 },
            { type: 'basic', delay: 2000 },
            { type: 'basic', delay: 2000 }
        ],
        reward: 40
    },
    {
        enemies: [
            { type: 'tank', delay: 0 },
            { type: 'tank', delay: 2500 },
            { type: 'fast', delay: 1500 },
            { type: 'fast', delay: 1500 },
            { type: 'basic', delay: 2000 },
            { type: 'basic', delay: 2000 }
        ],
        reward: 45
    },
    {
        enemies: [
            { type: 'basic', delay: 0 },
            { type: 'basic', delay: 1500 },
            { type: 'fast', delay: 2000 },
            { type: 'fast', delay: 2000 },
            { type: 'tank', delay: 2500 },
            { type: 'tank', delay: 2500 },
            { type: 'tank', delay: 2500 }
        ],
        reward: 50
    },
    {
        enemies: [
            { type: 'fast', delay: 0 },
            { type: 'fast', delay: 1500 },
            { type: 'fast', delay: 1500 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'basic', delay: 1500 }
        ],
        reward: 55
    },
    {
        enemies: [
            { type: 'tank', delay: 0 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'fast', delay: 1500 },
            { type: 'fast', delay: 1500 },
            { type: 'basic', delay: 2000 },
            { type: 'basic', delay: 2000 }
        ],
        reward: 60
    },
    {
        enemies: [
            { type: 'basic', delay: 0 },
            { type: 'basic', delay: 1500 },
            { type: 'fast', delay: 2000 },
            { type: 'fast', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 }
        ],
        reward: 65
    },
    {
        enemies: [
            { type: 'fast', delay: 0 },
            { type: 'fast', delay: 1500 },
            { type: 'fast', delay: 1500 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'basic', delay: 1500 }
        ],
        reward: 70
    },
    {
        enemies: [
            { type: 'tank', delay: 0 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'fast', delay: 1500 },
            { type: 'fast', delay: 1500 },
            { type: 'basic', delay: 2000 }
        ],
        reward: 75
    },
    {
        enemies: [
            { type: 'basic', delay: 0 },
            { type: 'basic', delay: 1500 },
            { type: 'fast', delay: 2000 },
            { type: 'fast', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 }
        ],
        reward: 80
    },
    {
        enemies: [
            { type: 'fast', delay: 0 },
            { type: 'fast', delay: 1500 },
            { type: 'fast', delay: 1500 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'basic', delay: 1500 }
        ],
        reward: 85
    },
    {
        enemies: [
            { type: 'tank', delay: 0 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'fast', delay: 1500 },
            { type: 'fast', delay: 1500 },
            { type: 'basic', delay: 2000 }
        ],
        reward: 90
    },
    {
        enemies: [
            { type: 'basic', delay: 0 },
            { type: 'basic', delay: 1500 },
            { type: 'fast', delay: 2000 },
            { type: 'fast', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 }
        ],
        reward: 95
    },
    {
        enemies: [
            { type: 'fast', delay: 0 },
            { type: 'fast', delay: 1500 },
            { type: 'fast', delay: 1500 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'tank', delay: 2000 },
            { type: 'basic', delay: 1500 }
        ],
        reward: 100
    }
];
