class Scenario {
    constructor(data) {
        this.data = data;
        return this;
    }
    getMonsterById(id, list){
        if (!list) list = monsters;
        return list.find(monster => {
            return monster.getId() === id;
        });
    }
    getId(){
        return this.data.name.en;
    }
    getExpId(){
        return this.data.expansion;
    }
    getName(){
        return this.data.name[app.lang];
    }
    hasMonster(targetMonster){
        let result = false;
        this.data.monsterGropus.forEach(group => {
            group.monsters.forEach(scenarioMonster => {
                if (scenarioMonster.id) {
                    if (scenarioMonster.id === targetMonster.getId()) result = true;
                } else if (scenarioMonster.type) {
                    if (targetMonster.hasTypeId(scenarioMonster.type)) result = true;
                }
            });
        });
        return result;
    }
    translateMonsterType(typeId){
        let len = monsters.length;
        for (let i = 0; i < len; i++ ) {
            const monster = monsters[i];
            if (monster.hasTypeId(typeId)) return monster.getType(typeId);
        }
        return undefined;
    }
    getGroupedMonsters() {
        const lang = app.lang;
        const cloneMonsters = monsters.map(monster => monster.clone());

        const result = [];
        this.data.monsterGropus.forEach(monsterGroup => {

            const group = {
                name: monsterGroup.name[lang], // Monster Deck, Set aside, ...
                column1: [],
                column2: [],
            }
            
            // monsters by id
            const column1_group_name = 'singoli';
            const column1_group = [];

            monsterGroup.monsters.forEach(scenarioItem => {
                if (!scenarioItem.id) return;
                const cloneMonster = this.getMonsterById(scenarioItem.id, cloneMonsters);
                if (!cloneMonster) throw new Error ("monster name not found: " + scenarioItem.id);
                if (!options.isExpansionAvailable(cloneMonster)) return;
                cloneMonster.subtractQuantity(scenarioItem.quantity);
                if (cloneMonster.availableQuantity() < 0) throw new Error ("monster quantity not available: " + scenarioItem.id);
                column1_group.push({
                    id: cloneMonster.getId(),
                    name: cloneMonster.getName(),
                    slug: cloneMonster.getSlug(),
                    monster: cloneMonster,
                    groupName: group.name,
                    quantity: scenarioItem.quantity
                });
            });

            column1_group.sort((a, b) => a.name.localeCompare(b.name, lang));
            group.column1.push({
                name: column1_group_name,
                monsters: column1_group
            });
        
            if (!monsterGroup.monsters.find(item => item.type)) {
                result.push(group);
                return;
            }
            
            // monsters by type
            const column2_groups = [];

            monsterGroup.monsters.forEach(scenarioItem => {
                if (!scenarioItem.type) return;

                const monsterTypeId = scenarioItem.type;

                const column2_group_name = this.translateMonsterType(monsterTypeId);
                const column2_group = [];

                const monstersWithType = cloneMonsters.filter(m => options.isExpansionAvailable(m) && m.hasTypeId(monsterTypeId) && m.availableQuantity() > 0);
                if (!monstersWithType) throw new Error("monster type not found: " + monsterTypeId);
                if (!monstersWithType.length) return;

                monstersWithType.forEach(cloneMonster => {
                    if (!options.isExpansionAvailable(cloneMonster)) return;
                    column2_group.push({
                        id: cloneMonster.getId(),
                        name: cloneMonster.getName(),
                        slug: cloneMonster.getSlug(),
                        monster: cloneMonster,
                        groupName: group.name,
                        quantity: cloneMonster.availableQuantity()
                    });
                });

                column2_group.sort((a, b) => a.name.localeCompare(b.name, lang));
                group.column2.push({
                    name: column2_group_name,
                    monsters: column2_group
                });

            });

            result.push(group);
            
        });
        return result;
    }
    getMonsters(){
        let result = [];
        this.getGroupedMonsters().forEach(section => {
            section.column1.forEach(group => { result = result.concat(group.monsters); });
            section.column2.forEach(group => { result = result.concat(group.monsters); });
        });
        result.sort((a, b) => a.name.localeCompare(b.name));
        return result;
    }
    getMonstersIds(){
        return this.getMonsters().map(item => item.id);
    }
    getUniqueMonsters(){
        let uniqueMonstersIds = this.getMonstersIds();
        scenarios.forEach(otherScenario => {
            if (otherScenario.getId() === this.getId()) return;
            uniqueMonstersIds = _.difference(uniqueMonstersIds, otherScenario.getMonstersIds());
        });
        const currScenarioMonsters = this.getMonsters();
        return currScenarioMonsters.filter(wrapperMonster => uniqueMonstersIds.indexOf(wrapperMonster.id) !== -1);
    }
    getGroupedHTML(){
        let uniqueMonsters = null;
        if (options.readOption('highlightUnique')) uniqueMonsters = this.getUniqueMonsters();
        const ocrOption = options.readOption('ocr');
        const countOption = options.readOption('count');
        const lang = app.lang;
        const cloneMonsters = monsters.map(monster => monster.clone());
        let html = '';
        this.data.monsterGropus.forEach(group => {
            // console.log("group",group.name.it);
            const groupMonsters = group.monsters;
            html += '<ul class="scenario-group">';
                html += '<li>';
                    html += '<div class="scenario-group-name">';
                        html += group.name[lang];
                    html += '</div>';
                    html += '<ul class="scenario-group-columns">';
                        html += '<li class="scenario-group-column-1">';
                            html += '<div class="scenario-group-column-title">';
                                html += l('SPECIFIC_MONSTERS');
                            html += '</div>';
                            html += '<ul class="scenario-group-monsters-list">';
                            groupMonsters.sort((a, b) => {
                                if (!a.id || !b.id) return 0;
                                const ma = this.getMonsterById(a.id, cloneMonsters);
                                const mb = this.getMonsterById(b.id, cloneMonsters);
                                return ma.getName().localeCompare(mb.getName(), lang);
                            });
                            var q = 0;
                            groupMonsters.forEach(scenarioItem => {
                                if (!scenarioItem.id) return;
                                const cloneMonster = this.getMonsterById(scenarioItem.id, cloneMonsters);
                                if (!cloneMonster) {
                                    throw new Error ("monster name not found: " + scenarioItem.id);
                                }
                                if (!options.isExpansionAvailable(cloneMonster)) {
                                    return;
                                }
                                cloneMonster.subtractQuantity(scenarioItem.quantity);
                                const name = cloneMonster.getName();
                                const slug = cloneMonster.getSlug();
                                let quantity = '';
                                if (ocrOption && countOption) {
                                    quantity = ( scenarioItem.quantity > 1 ) ? `&nbsp;<span class="count">(<span class="counter">0</span>/<span class="total">${scenarioItem.quantity}</span>)</span>` : `` ;
                                } else {
                                    quantity = ( scenarioItem.quantity > 1 ) ? `&nbsp;(${scenarioItem.quantity})` : `` ;
                                }
                                // console.log("name",name);
                                let cssClass = '';
                                if (uniqueMonsters) {
                                    if (_.findWhere(uniqueMonsters, {id: cloneMonster.getId()})) {
                                        cssClass = 'scenario-monsters-list-unique';
                                    }
                                }
                                q++;
                                html += `<li class="scenario-monsters-li ${cssClass}" data-slug="${slug}"><div class="content">${name}${quantity}</div></li>`;
                            });
                            if (!q) {
                                html += `<li class="scenario-monsters-li noitems"><div class="content">${l('NO_MONSTERS')}</div></li>`;
                            }
                            html += '</ul>';
                        html += '</li>';
                        
                        if (!groupMonsters.find(item => item.type)) return;

                        html += '<li class="scenario-group-column-2">';
                        groupMonsters.forEach(scenarioItem => {
                            if (!scenarioItem.type) return;
                            // console.log("type",monster.type);
                            const monsterTypeId = scenarioItem.type;
                            const typeMonsters = cloneMonsters.filter(m => options.isExpansionAvailable(m) && m.hasTypeId(monsterTypeId) && m.availableQuantity() > 0);
                            if (!typeMonsters) {
                                throw new Error("monster type not found: " + monsterTypeId);
                            }
                            if (!typeMonsters.length) {
                                return;
                            }
                            const monsterTypeDisplay = this.translateMonsterType(monsterTypeId);
                            html += '<div class="scenario-group-column-title">';
                                html += l('ALL_TYPE_MONSTERS', monsterTypeDisplay)
                            html += '</div>';
                            html += '<ul class="scenario-group-monsters-list">';
                            typeMonsters.sort((ma, mb) => {
                                return ma.getName().localeCompare(mb.getName(), lang);
                            });
                            var q = 0;
                            typeMonsters.forEach(monster => {
                                const name = monster.getName();
                                const slug = monster.getSlug();
                                let quantity = '';
                                if (ocrOption && countOption) {
                                    quantity = ( monster.availableQuantity() > 1 ) ? `&nbsp;<span class="count">(<span class="counter">0</span>/<span class="total">${monster.availableQuantity()}</span>)</span>` : `` ;
                                } else {
                                    quantity = ( monster.availableQuantity() > 1 ) ? `&nbsp;(${monster.availableQuantity()})` : `` ;
                                }
                                // console.log("name",name);
                                let cssClass = '';
                                if (uniqueMonsters) {
                                    if (_.findWhere(uniqueMonsters, {id: monster.getId()})) {
                                        cssClass = 'scenario-monsters-list-unique';
                                    }
                                }
                                q++;
                                html += `<li class="scenario-monsters-li ${cssClass}" data-slug="${slug}"><div class="content">${name}${quantity}</div></li>`;
                            });
                            if (!q) {
                                html += `<li class="scenario-monsters-li noitems"><div class="content">${l('NO_MONSTERS')}</div></li>`;
                            }
                            html += '</ul>';
                        });
                        html += '</li>';
                        
                    html += '</ul>';
                html += '</li>';
            html += '</ul>';
        });
        return html;
    }
    getFlatHTML(){
        let uniqueMonsters = null;
        if (options.readOption('highlightUnique')) uniqueMonsters = this.getUniqueMonsters();
        const ocrOption = options.readOption('ocr');
        const countOption = options.readOption('count');
        let html = '';
        html += '<ul class="scenario-flat">';
        this.getMonsters().forEach(item => {
            const name = item.name;
            const slug = item.slug;
            const groupName = item.groupName;
            let quantity = '';
            if (ocrOption && countOption) {
                quantity = ( item.quantity > 1 ) ? `&nbsp;<span class="count">(<span class="counter">0</span>/<span class="total">${item.quantity}</span>)</span>` : `` ;
            } else {
                quantity = ( item.quantity > 1 ) ? `&nbsp;(${item.quantity})` : `` ;
            }
            let cssClass = '';
            if (uniqueMonsters) {
                if (_.findWhere(uniqueMonsters, {id: item.id})) {
                    cssClass = 'scenario-monsters-list-unique';
                }
            }
            html += `
            <li class="scenario-monsters-li ${cssClass}" data-slug="${slug}">
                <div class="content">
                    <div class="monster-name">${name}${quantity}</div>
                    <div class="group-name">${groupName}</div>
                </div>
            </li>`;
        });
        html += '</ul>';
        return html;
    }
    count (monster, ancestorElement) {
        const slug = monster.getSlug();
        (ancestorElement || document).querySelectorAll(`.scenario-monsters-li[data-slug="${slug}"]`).forEach(monsterRow => {
            const content          = monsterRow.querySelector('.content');
            const groupNameElement = monsterRow.querySelector('.group-name');
            const counter          = content.querySelector('.counter');
            const total            = content.querySelector('.total');
            let c                  = counter ? Number(counter.textContent) : 0;
            const t                = total   ? Number(total.textContent)   : 1;
            c += 1;
            if (counter) counter.textContent = c;
            monsterRow.classList.remove('progress', 'complete', 'warning');
            content.style.backgroundColor = '';
            content.style.color = '';
            if (groupNameElement) groupNameElement.style.color = '';
            if (c < t) {
                monsterRow.classList.add('progress');
                const perc = c/t;
                const bgColor = new Color([120, 100, 53], {type: 'hsl'}).setLight(100, perc).toHex();
                const txtColor = new Color(bgColor).invertColor({blackAndWhite: true}).toHex();

                content.style.backgroundColor = bgColor;
                content.style.color = txtColor;
                if (groupNameElement) groupNameElement.style.color = txtColor;
            } else if (c === t) {
                monsterRow.classList.add('complete');
            } else if (c > t) {
                monsterRow.classList.add('warning');
            }
        });
    }
}