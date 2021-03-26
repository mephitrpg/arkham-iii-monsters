var options = {

    initialize: function() {
        
        if (!localStorage.getItem('options')) localStorage.setItem('options','{}');

        const options = _.defaults(this.readOptions(), {
            scenarioId: scenarios[0].getId(),
            sound: true,
            ocr: false,
            count: true,
            highlightUnique: false,
            group: false,
            expDON: true,
            expUDW: true,
        });
        
        this.saveOptions(options);
        
        _.each(options, (value, key) => { this[key] = value; });

        // sound
        const soundElement = this.soundElement = document.getElementById('options-sound-switch');
        soundElement.checked = this.readOption('sound');
        soundElement.addEventListener('change', this.onSoundChange.bind(this));

        // ocr
        const ocrElement = this.ocrElement = document.getElementById('options-ocr-switch');
        ocrElement.checked = this.readOption('ocr');
        ocrElement.addEventListener('change', this.onOcrChange.bind(this));

        this.applyOcrOption();

        // count ocr
        const countElement = this.countElement = document.getElementById('options-count-switch');
        countElement.checked = this.readOption('count');
        countElement.addEventListener('change', this.onCountChange.bind(this));

        // highlight unique monsters
        const highlightUniqueElement = this.highlightUniqueElement = document.getElementById('options-highlightUnique-switch');
        highlightUniqueElement.checked = this.readOption('highlightUnique');
        highlightUniqueElement.addEventListener('change', this.onHighlightUniqueChange.bind(this));

        // group
        const groupElement = this.groupElement = document.getElementById('options-group-switch');
        groupElement.checked = this.readOption('group');
        groupElement.addEventListener('change', this.onGroupChange.bind(this));

        // expansions
        const expDONElement = this.expDONElement = document.getElementById('options-expDON-switch');
        expDONElement.checked = this.readOption('expDON');
        expDONElement.addEventListener('change', this.onExpDONChange.bind(this));

        const expUDWElement = this.expUDWElement = document.getElementById('options-expUDW-switch');
        expUDWElement.checked = this.readOption('expUDW');
        expUDWElement.addEventListener('change', this.onExpUDWChange.bind(this));

    },

    saveOption: function(key, value){
        this[key] = value;
        const options = this.readOptions();
        options[key] = value;
        this.saveOptions(options);
    },

    saveOptions: function(options) {
        localStorage.setItem('options', JSON.stringify(options));
    },

    readOption: function(key){
        return this[key];
    },

    readOptions: function(name, value){
        return JSON.parse(localStorage.getItem('options'));
    },

    isExpansionAvailable(scenarioOrMonster) {
        const expId = scenarioOrMonster.getExpId();
        const expansion = expansions.find(expansion => expansion.getId() === expId);
        if (!expansion) return false;
        const EXP = expansion.getCode();
        if ( EXP === "BASE" ) return true;
        return this.readOption(`exp${EXP}`);
    },

    onSoundChange: function(event) {
        if (event.target.checked) {
            this.saveOption('sound', true);
        } else {
            this.saveOption('sound', false);
        }
    },

    onOcrChange: function(event) {
        if (event.target.checked) {
            this.saveOption('ocr', true);
            app.showOcr();
        } else {
            this.saveOption('ocr', false);
            app.hideOcr();
        }
        this.applyOcrOption();
    },

    applyOcrOption: function() {
        const row = document.getElementById('options-count');
        let originalDisplay = row.getAttribute('data-original-display');
        if (!originalDisplay) {
            originalDisplay = getComputedStyle(row).display;
            row.setAttribute('data-original-display', originalDisplay);
        }
        row.style.display = this.readOption('ocr') ? originalDisplay : 'none' ;
    },

    onCountChange: function(event) {
        if (event.target.checked) {
            this.saveOption('count', true);
        } else {
            this.saveOption('count', false);
        }
        app.renderScenario();
    },

    onHighlightUniqueChange: function(event) {
        if (event.target.checked) {
            this.saveOption('highlightUnique', true);
        } else {
            this.saveOption('highlightUnique', false);
        }
        app.renderScenario();
    },

    onGroupChange: function(event) {
        if (event.target.checked) {
            this.saveOption('group', true);
        } else {
            this.saveOption('group', false);
        }
        app.renderScenario();
    },

    onExpDONChange: function(event) {
        if (event.target.checked) {
            this.saveOption('expDON', true);
        } else {
            this.saveOption('expDON', false);
        }
        app.populateScenarioSelector();
    },

    onExpUDWChange: function(event) {
        if (event.target.checked) {
            this.saveOption('expUDW', true);
        } else {
            this.saveOption('expUDW', false);
        }
        app.populateScenarioSelector()
    },

}
