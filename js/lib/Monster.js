class Monster {
    constructor(data) {
        this.data = data;
        data.slug = {};
        Object.keys(data.name).forEach(l => {
            data.slug[l] = _s(data.name[l]).slugify().value();
        });
        return this;
    }
    getId(){
        return this.data.name.en;
    }
    getName(lang){
        return this.data.name[lang || app.lang];
    }
    getSlug(lang){
        return this.data.slug[lang || app.lang];
    }
    getTypesIds(){
        return this.data.type.en;
    }
    getTypes(lang){
        return this.data.type[lang || app.lang];
    }
    getType(typeId){
        const i = this.getTypesIds().indexOf(typeId);
        return this.getTypes()[i];
    }
    hasTypeId(type){
        return this.getTypesIds().indexOf(type) !== -1;
    }
    getExpId(){
        return this.data.expansion;
    }
    clone(){
        return new Monster(JSON.parse(JSON.stringify(this.data)));
    }
    subtractQuantity(q) {
        let quantity = this.data.quantity;
        quantity -= q;
        this.data.quantity = quantity;
        return quantity;
    }
    availableQuantity() {
        return this.data.quantity;
    }
}