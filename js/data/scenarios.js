let scenarios = [
    {
        "name": { "en": "Feast for Umôrdhoth", "it": "Il Banchetto di Umôrdhoth", "es": "Festín para Umôrdhoth", "fr": "Un Festin pour Umôrdhoth" },
        "expansion": "Base Game",
        "monsterGropus": [
            { "name": {"en": "Monster Deck", "it": "Mazzo dei Mostri", "es": "Mazo de Monstruos", "fr": "Deck de Monstres"}, "monsters": [
                { "id": "Masked Ones", "quantity": 1 },
                { "id": "Hooded Stalker", "quantity": 2 },
                { "id": "Corpse-Taker", "quantity": 1 },
                { "id": "Eyeless Watcher", "quantity": 1 },
                { "id": "Abyssal Servant", "quantity": 1 },
                { "type": "Ghoul", "quantity": "all" }
            ]},
            { "name": {"en": "Worshipers of Umôrdhoth", "it": "Adoratori di Umôrdhoth", "es": "Adoradores de Umôrdhoth", "fr": "Les Adorateurs d'Umôrdhoth"}, "monsters": [
                { "id": "Alma Hill", "quantity": 1 },
                { "id": "Billy Cooper", "quantity": 1 },
                { "id": "Masked Hunter", "quantity": 1 },
                { "id": "\"Wolf-Man\" Drew", "quantity": 1 },
                { "id": "Herman Collins", "quantity": 1 },
                { "id": "Ruth Turner", "quantity": 1 }
            ]}
        ]
    },
    {
        "name": { "en": "The Pale Lantern", "it": "La Lanterna Pallida", "es": "La Lámpara Mortecina", "fr":"La Lanterne Pâle" },
        "expansion": "Under Dark Waves",
        "monsterGropus": [
            { "name": {"en": "Monster Deck", "it": "Mazzo dei Mostri", "es": "Mazo de Monstruos", "fr": "Deck de Monstres"}, "monsters": [
                { "id": "Guardian Beast", "quantity": 1 },
                { "id": "Robed Figure", "quantity": 3 },
                { "id": "Prowling Abductor", "quantity": 2 },
                { "id": "Void Touched", "quantity": 2 },
                { "id": "Terrified Wanderer", "quantity": 2 },
                { "type": "Byakhee", "quantity": "all" },
                { "type": "Moon-Beast", "quantity": "all" }
            ]},
            { "name": {"en": "Set aside", "it": "Messi da parte", "es": "Apartar a un lado", "fr": "Mettez de côté"}, "monsters": [
                { "id": "Declan Pearce", "quantity": 1 }
            ]}
        ]
    },
    {
        "id": "approach-of-azathoth",
        "name": { "en": "Approach of Azathoth", "it": "La Venuta di Azathoth", "es": "La llegada de Azathoth", "fr": "La Venue d'Azathoth" },
        "expansion": "Base Game",
        "monsterGropus": [
            { "name": {"en": "Monster Deck", "it": "Mazzo dei Mostri", "es": "Mazo de Monstruos", "fr": "Deck de Monstres"}, "monsters": [
                { "id": "Abyssal Servant", "quantity": 1 },
                { "id": "Eyeless Watcher", "quantity": 1 },
                { "id": "High Priest", "quantity": 1 },
                { "id": "Hooded Stalker", "quantity": 2 },
                { "id": "Occult Ritualist", "quantity": 2 },
                { "id": "Robed Figure", "quantity": 3 },
                { "id": "Swift Byakhee", "quantity": 1 },
                { "type": "Hound of Tindalos", "quantity": "all" }
            ]}
        ]
    },
    {
        "name": { "en": "Tyrants of Ruin", "it": "I Tiranni della Rovina", "es": "Tiranos de la desolación", "fr": "Tyrans de l'Abîme" },
        "expansion": "Under Dark Waves",
        "monsterGropus": [
            { "name": {"en": "Monster Deck", "it": "Mazzo dei Mostri", "es": "Mazo de Monstruos", "fr": "Deck de Monstres"}, "monsters": [
                { "id": "Altered Beast", "quantity": 2 },
                { "id": "Hulking Thrall", "quantity": 2 },
                { "id": "Prowling Abductor", "quantity": 2 },
                { "type": "Deep One", "quantity": "all" }
            ]}
        ]
    },
    {
        "name": { "en": "Silence of Tsathoggua", "it": "Il Silenzio di Tsathoggua", "es": "El silencio de Tsathoggua", "fr":"Le Silence de Tsathoggua" },
        "expansion": "Dead of Night",
        "monsterGropus": [
            { "name": {"en": "Monster Deck", "it": "Mazzo dei Mostri", "es": "Mazo de Monstruos", "fr": "Deck de Monstres"}, "monsters": [
                { "id": "Cerebral Extractor", "quantity": 1 },
                { "id": "Grasping Fungus", "quantity": 2 },
                { "id": "Capricious Stalker", "quantity": 1 },
                { "id": "Eyeless Watcher", "quantity": 1 },
                { "id": "Occult Ritualist", "quantity": 2 },
                { "type": "Aberration", "quantity": "all" },
                { "type": "Formless Spawn", "quantity": "all" }
            ]}
        ]
    },
    {
        "name": { "en": "Shots in the Dark", "it": "Spari nella Notte", "es": "Disparos en la oscuridad", "fr":"Des Tirs dans la Nuit" },
        "expansion": "Dead of Night",
        "monsterGropus": [
            { "name": {"en": "Monster Deck", "it": "Mazzo dei Mostri", "es": "Mazo de Monstruos", "fr": "Deck de Monstres"}, "monsters": [
                { "id": "Brawling Riot", "quantity": 1 },
                { "id": "Ghoul Acolyte", "quantity": 2 },
                { "id": "Vicious Glutton", "quantity": 2 },
                { "id": "Feckless Agitator", "quantity": 1 },
                { "id": "Occult Ritualist", "quantity": 2 },
                { "id": "Mouthy Recanteur", "quantity": 1 },
                { "type": "Nightgaunt", "quantity": "all" }
            ]},
            { "name": {"en": "O'Bannion", "it": "O'Bannion", "es": "O'Bannion", "fr": "O'Bannion"}, "monsters": [
                { "type": "O'Bannion", "quantity": "all" }
            ]},
            { "name": {"en": "Sheldon", "it": "Sheldon", "es": "Sheldon", "fr": "Sheldon"}, "monsters": [
                { "type": "Sheldon", "quantity": "all" }
            ]}
        ]
    },
    {
        "name": { "en": "Dreams of R'lyeh", "it": "Sogni di R'lyeh", "es": "Sueños de R'lyeh", "fr":"Rêves de R'lyeh" },
        "expansion": "Under Dark Waves",
        "monsterGropus": [
            { "name": {"en": "Monster Deck", "it": "Mazzo dei Mostri", "es": "Mazo de Monstruos", "fr": "Deck de Monstres"}, "monsters": [
                { "id": "Shoreline Brute", "quantity": 1 },
                { "id": "Sea Singer", "quantity": 1 },
                { "id": "Shallows Predator", "quantity": 2 },
                { "id": "Occult Ritualist", "quantity": 2 },
                { "id": "High Priest", "quantity": 1 },
                { "type": "Dreaming", "quantity": "all" },
                { "type": "Star Spawn", "quantity": "all" }
            ]}
        ]
    },
    {
        "name": { "en": "Veil of Twilight", "it": "Il Velo del Crepuscolo", "es": "El velo del crepúsculo", "fr":"Le Voile du Crépuscule" },
        "expansion": "Base Game",
        "monsterGropus": [
            { "name": {"en": "Monster Deck", "it": "Mazzo dei Mostri", "es": "Mazo de Monstruos", "fr": "Deck de Monstres"}, "monsters": [
                { "id": "Altered Beast", "quantity": 2 },
                { "id": "Whippoorwill", "quantity": 2 },
                { "type": "Thrall", "quantity": "all" }
            ]},
            { "name": {"en": "Set aside", "it": "Messi da parte", "es": "Apartar a un lado", "fr": "Mettez de côté"}, "monsters": [
                { "type": "Lodge", "quantity": "all" }
            ]}
        ]
    },
    {
        "name": { "en": "Ithaqua's Children", "it": "La Progenie di Ithaqua", "es": "La progenie de Ithaqua", "fr": "La Descendance d'Ithaqua" },
        "expansion": "Under Dark Waves",
        "monsterGropus": [
            { "name": {"en": "Monster Deck", "it": "Mazzo dei Mostri", "es": "Mazo de Monstruos", "fr": "Deck de Monstres"}, "monsters": [
                { "id": "Ravenous Predator", "quantity": 1 },
                { "id": "Icebound Captive", "quantity": 2 },
                { "id": "Hulking Thrall", "quantity": 2 },
                { "id": "Lupine Thrall", "quantity": 1 },
                { "id": "Altered Servant", "quantity": 2 },
                { "id": "Avian Thrall", "quantity": 1 },
                { "id": "High Priest", "quantity": 1 },
                { "id": "Accursed Somnambulist", "quantity": 2 },
                { "id": "Terrified Wanderer", "quantity": 2 },
                { "type": "Shantak", "quantity": "all" }
            ]}
        ]
    },
    {
        "name": { "en": "Echoes of the Deep", "it": "Echi dal Profondo", "es": "Ecos de las profundidades", "fr": "Les Echos des Profondeurs" },
        "expansion": "Base Game",
        "monsterGropus": [
            { "name": {"en": "Monster Deck", "it": "Mazzo dei Mostri", "es": "Mazo de Monstruos", "fr": "Deck de Monstres"}, "monsters": [
                { "id": "R'lyeh Guardian", "quantity": 1 },
                { "id": "Hooded Stalker", "quantity": 2 },
                { "id": "Occult Ritualist", "quantity": 2 },
                { "type": "Deep One", "quantity": "all" }
            ]}
        ]
    },
    {
        "name": { "en": "The Key and The Gate", "it": "La Chiave e la Porta", "es": "La llave y la puerta", "fr": "La Clef et la Porte" },
        "expansion": "Secrets of the Order",
        "monsterGropus": [
            { "name": {"en": "Monster Deck", "it": "Mazzo dei Mostri", "es": "Mazo de Monstruos", "fr": "Deck de Monstres"}, "monsters": [
                { "id": "Bloody Titan", "quantity": 1 },
                { "id": "Corpse-Taker", "quantity": 1 },
                { "id": "Coursing Hound", "quantity": 1 },
                { "id": "Crazed Fiend", "quantity": 1 },
                { "id": "Gluttonous Giant", "quantity": 1 },
                { "id": "Keening Hound", "quantity": 1 },
                { "id": "Raging Poltergeist", "quantity": 3 },
                { "id": "Stalking Wraith", "quantity": 2 },
                { "id": "Tunneling Dhole", "quantity": 1 },
                { "id": "Whippoorwill", "quantity": 2 },
                { "type": "Thrall", "quantity": "all" }
            ]}
        ]
    },
    {
        "name": { "en": "The Dead Cry Out", "it": "Il Lamento dei Morti", "es": "Los muertos gritan", "fr": "Le Cri des Morts" },
        "expansion": "Secrets of the Order",
        "monsterGropus": [
            { "name": {"en": "Monster Deck", "it": "Mazzo dei Mostri", "es": "Mazo de Monstruos", "fr": "Deck de Monstres"}, "monsters": [
                { "id": "Abyssal Servant", "quantity": 1 },
                { "id": "Coursing Hound", "quantity": 1 },
                { "id": "Flesh-Eater", "quantity": 2 },
                { "id": "Haunting Dead", "quantity": 3 },
                { "id": "Nightmarish Fiend", "quantity": 1 },
                { "id": "Swift Byakhee", "quantity": 1 },
                { "id": "Tunneling Dhole", "quantity": 1 },
                { "id": "Vicious Glutton", "quantity": 2 },
                { "type": "Gug", "quantity": "all" },
                { "type": "Ghast", "quantity": "all" }
            ]}
        ]
    },
    {
        "name": { "en": "Bound to Serve", "it": "Vincolo di Servitù", "es": "Obligados a servir", "fr":"Asservis" },
        "expansion": "Secrets of the Order",
        "monsterGropus": [
            { "name": {"en": "Monster Deck", "it": "Mazzo dei Mostri", "es": "Mazo de Monstruos", "fr": "Deck de Monstres"}, "monsters": [
                { "id": "Flesh-Eater", "quantity": 2 },
                { "id": "High Priest", "quantity": 1 },
                { "id": "Lupine Thrall", "quantity": 1 },
                { "id": "Taloned Cannibal", "quantity": 2 },
                { "id": "Tindalos Alpha", "quantity": 1 },
                { "type": "Spirit", "quantity": "all" }
            ]},
            { "name": {"en": "Set aside", "it": "Messi da parte", "es": "Apartar a un lado", "fr": "Mettez de côté"}, "monsters": [
                { "type": "Lodge", "quantity": "all" }
            ]}
        ]
    }
]