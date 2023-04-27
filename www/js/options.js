var options = {

    initialize: function() {
        
        if (!localStorage.getItem('options')) localStorage.setItem('options','{}');

        const def = {
            scenarioId: scenarios[0].getId(),
            lang: app.lang,
            sound: true,
            ocr: false,
            count: true,
            highlightUnique: false,
            group: false,
        };

        expansions.forEach(exp=>{
            const code = exp.getCode();
            if (code !== 'BASE') def[`exp${code}`] = true;
        });

        const options = _.defaults(this.readOptions(), def);
        
        this.saveOptions(options);
        
        _.each(options, (value, key) => { this[key] = value; });

        // html
        expansions.forEach((exp)=>{
            const code = exp.getCode();
            const show = code === 'BASE' ? ' style="display:none;"' : '';
            const ckAttr = code === 'BASE' ? ` checked="checked" disabled="disabled"` : ` id="options-exp${code}-switch"`;
            const title = `OPTION_EXPANSIONS_${code}_TITLE`;
            const description = `OPTION_EXPANSIONS_${code}_DESCRIPTION`;
            $('#app-options .app-content').append(
                `<div class="options-row"${show}>
                    <div>
                        <div data-lang="${title}"></div>
                        <div class="description" data-lang="${description}"></div>
                    </div>
                    <div class="switch-wrapper">
                        <label class="switch"><!-- disabled -->
                            <input type="checkbox"${ckAttr}>
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>`
            );
        });

        // lang
        makeSelector({
            element: document.getElementById('options-lang-selector'),
            options: _.map(languages, language => [language.getName(), language.getId()]),
            value: _.find(languages, language => language.getId() == this.readOption('lang')).getId(),
            onChange: 'options.onLangChange',
        });

        if (app.isOCRavailable) {

            // sound
            const soundElement = this.soundElement = document.getElementById('options-sound-switch');
            soundElement.checked = this.readOption('sound');
            soundElement.addEventListener('change', this.onSoundChange.bind(this));

            // ocr
            const ocrElement = this.ocrElement = document.getElementById('options-ocr-switch');
            ocrElement.checked = this.readOption('ocr');
            ocrElement.addEventListener('change', this.onOcrChange.bind(this));

            // count ocr
            const countElement = this.countElement = document.getElementById('options-count-switch');
            countElement.checked = this.readOption('count');
            countElement.addEventListener('change', this.onCountChange.bind(this));

        } else {
            
            document.getElementById('options-sound').style.display = 'none';
            document.getElementById('options-ocr').style.display = 'none';
            document.getElementById('options-count').style.display = 'none';

        }

        this.applyOcrOption();

        // highlight unique monsters
        const highlightUniqueElement = this.highlightUniqueElement = document.getElementById('options-highlightUnique-switch');
        highlightUniqueElement.checked = this.readOption('highlightUnique');
        highlightUniqueElement.addEventListener('change', this.onHighlightUniqueChange.bind(this));

        // group
        const groupElement = this.groupElement = document.getElementById('options-group-switch');
        groupElement.checked = this.readOption('group');
        groupElement.addEventListener('change', this.onGroupChange.bind(this));

         // expansions
         expansions.forEach(exp=>{
            const code = exp.getCode();
            const expElement = this[`exp${code}Element`] = document.getElementById(`options-exp${code}-switch`);
            if (!expElement) return;
            expElement.checked = this.readOption(`exp${code}`);
            expElement.addEventListener('change', this.onExpChange.bind(this, code));
        });

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

    onLangChange: function (event) {
        const lang = event.target.value;
        options.saveOption('lang', lang);
        app.setLang(lang);
        app.renderScenario();
        app.applyLanguage();
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
        console.log('was-original',originalDisplay);
        if (!originalDisplay) {
            originalDisplay = getComputedStyle(row).display;
            row.setAttribute('data-original-display', originalDisplay);
        }
        console.log(this.readOption('ocr'), originalDisplay , 'none'  )
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

    onExpChange: function(code, event) {
        this.saveOption(`exp${code}`, event.target.checked);
        populateSelector({
            element: app.scenarioSelector,
            options: app.getAvailableScenarios().map(scenario => [scenario.getName(), scenario.getId()]),
        });
    },

}
