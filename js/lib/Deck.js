class Deck {
    constructor(monstersGroup) {
        this.name = monstersGroup.name;
        this.defaultMonstersGroup = monstersGroup;
        this.monsters = [];
        this.reset();
        return this;
    }
    reset () {
        const group = this.defaultMonstersGroup;
        const monsters = this.monsters = [];
        [group.column1, group.column2].forEach(column => {
            column.forEach(paragraph => {
                paragraph.monsters.forEach(monster => {
                    const monsterClone = JSON.parse(JSON.stringify(monster));
                    const quantity = monsterClone.quantity;
                    delete monsterClone.quantity;
                    for (let i = 0; i < quantity; i++) {
                        monsters.push(monsterClone);
                    }
                });
            });
        });
        this.shuffle();
    }
    shuffle () {
        // https://stackoverflow.com/a/2450976

        const array = this.monsters;
        let currentIndex = array.length,  randomIndex;
        
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
        
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
        
            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]
            ];
        }
        
        return array;
    }
}