class Expansion {
    constructor(data) {
        this.data = data;
        return this;
    }
    getId() {
        return this.data.name.en;
    }
    getCode() {
        return this.data.code;
    }
    getName(lang) {
        return this.data.name[lang || app.lang];
    }
}