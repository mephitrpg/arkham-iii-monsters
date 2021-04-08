class Language {
    constructor (data) {
        this.data = data;
        return this;
    }
    getId() {
        return this.data.id;
    }
    getName() {
        return this.data.name;
    }
    isDefault() {
        return this.data.default;
    }
    getString(str) {
        return this.data.strings[str];
    }
}