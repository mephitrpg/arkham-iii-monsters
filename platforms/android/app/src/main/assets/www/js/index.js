var _s = s;
var app_started = new Date();

function makeTabs(tabs) {
    tabs.forEach(tab => {
        const [ button, content, callback ] = tab;
        button.addEventListener('click', () => {
            tabs.forEach(tb => {
                const [ btn, cnt ] = tb;
                btn.classList.remove('active');
                cnt.classList.remove('active');
                cnt.style.display = 'none';
            });
            button.classList.add('active');
            content.classList.add('active');
            content.style.display = 'block';
            if (typeof callback === 'function') callback(button, content);
        });
    });
    const [ firstButton ] = tabs[0];
    firstButton.dispatchEvent(new Event('click'));
}

function l(str) {
    console.log("str",str,app.currentLanguage,app.currentLanguage.getString(str))
    return app.currentLanguage.getString(str);
}

var app = {

    // Application Constructor
    initialize: function() {

        this.optionOcrWas = null;
        this.optionCountWas = null;

        this.sounds = {};
        this.isCameraActive = false;
        this.isPause = true;

        this.previewWidth    = window.screen.width;
        this.previewHeight   = window.screen.height * 0.33;

        languages = _.each(languages, (item, id) => { languages[id] = new Language(item); });

        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener("pause", this.onPause.bind(this), false);
        document.addEventListener("resume", this.onResume.bind(this), false);

    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {

        const defaultLang = _.find(languages, language => language.isDefault());
        this.currentLanguage = defaultLang;
        this.lang = defaultLang.getId();
        navigator.globalization.getLocaleName((locale) => {
            const currentLang = locale.value.split(',')[0].split('-')[0];
            const supportedLang = _.find(languages, language => language.getId() === currentLang);
            if (supportedLang) {
                this.currentLanguage = supportedLang;
                this.lang = supportedLang.getId();
            }
            this.prepareApp();
        }, (e) => {
            console.error(e);
            this.prepareApp();
        });

    },

    prepareApp: function() {

        this.appElement               = document.getElementById('app');
        
        this.snapshotElement          = document.getElementById('snapshot');
        this.ocrBlockElement          = document.getElementById('card-ocr-block');
        this.monstersContentElement   = document.getElementById('app-ui');
        this.optionsContentElement    = document.getElementById('app-options');

        this.ocrTextElement           = document.getElementById('card-name');
        this.monsterListELement       = document.getElementById('monster-list');
        this.scenarioSelector         = document.getElementById('scenario-selector');
        this.scenarioNameElement      = document.getElementById('scenario-name');

        this.ocrTextElement.innerHTML = l('DEFAULT_OCR_TEXT');

        // mdls command in terminal to get file duration in seconds
        const androidBasePath         = "/android_asset/www";
        const filepathOK              = [androidBasePath, "sounds", "match-yes.mp3"].join('/');
        const filepathKO              = [androidBasePath, "sounds", "match-no.mp3"].join('/');
        // const filepathBG              = [androidBasePath, "sounds", "bg.wav"].join('/');
        this.sounds.ok                = {media: new Media(filepathOK), duration: 3736};
        this.sounds.ko                = {media: new Media(filepathKO), duration: 3736};
        // this.sounds.bg                = {media: new Media(filepathBG), duration: };

        expansions = expansions.map(item => new Expansion(item));

        monsters = monsters.map(item => new Monster(item));
        
        scenarios = scenarios.map(item => new Scenario(item));
        scenarios.sort((a, b) => a.getName().localeCompare(b.getName(), this.lang));

        options.initialize();

        this.applyLanguage();

        this.onAppReady();
    },

    applyLanguage: function() {

        // document.querySelector('html').className = this.lang;

        document.querySelectorAll('[data-lang]').forEach(element => {
            const str = element.getAttribute('data-lang');
            element.innerHTML = l(str);
        });

    },

    // Update DOM on a Received Event
    onAppReady: function() {
        // this.sound('bg', 12000);
        
        // tab bar
        makeTabs([
            [
                document.getElementById('tab-bar-monsters'),
                this.monstersContentElement,
                this.onTabMonstersActive.bind(this),
            ],
            [
                document.getElementById('tab-bar-options'),
                this.optionsContentElement,
                this.onTabOptionsActive.bind(this),
            ],
        ]);

        this.populateScenarioSelector(options.readOption('scenarioId'));

        this.scenarioNameElement.addEventListener('click', (ev) => {
            var e = document.createEvent('MouseEvents');
            e.initMouseEvent('mousedown', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            this.scenarioSelector.dispatchEvent(e);
        });

        (function hideSplashScreen() {
            if (new Date() - app_started < 2000 ) setTimeout(hideSplashScreen, 20);
            else navigator.splashscreen.hide();
        })();

    },

    onPause: function() {
        if (options.readOption('ocr')) this.stopCamera();
        this.sounds.ok.media.stop();
        this.sounds.ko.media.stop();
    },

    onResume: function() {
        if (options.readOption('ocr')) this.startCamera();
    },

    populateScenarioSelector: function(scenarioId) {
        const scenarioSelector = this.scenarioSelector;

        scenarioId = scenarioId || scenarioSelector.value;
        scenarioSelector.removeEventListener('change', this.selectScenario);

        let i = scenarioSelector.options.length;
        while (i--) scenarioSelector.options[i] = null;
        scenarios.forEach(scenario => {
            if (options.isExpansionAvailable(scenario)) {
                var option = new Option(`${scenario.getName()}`, scenario.getId());
                scenarioSelector.add(option);
            }
        });
        if (scenarioId) scenarioSelector.value = scenarioId;
        if (scenarioSelector.options.selectedIndex === -1) scenarioSelector.options.selectedIndex = 0;

        scenarioSelector.addEventListener('change', this.selectScenario.bind(this));
        scenarioSelector.dispatchEvent(new Event('change'));
    },

    onTabMonstersActive: function() {
        if (this.optionOcrWas === null) {
            this.optionOcrWas = !options.readOption('ocr');
            this.optionCountWas = !options.readOption('count');
        }
        if (options.readOption('ocr')) {
            this.showOcr();
            this.startCamera();
        } else {
            this.hideOcr();
        }
        if ( options.readOption('ocr') !== this.optionOcrWas || options.readOption('count') !== this.optionCountWas  ) {
            this.optionOcrWas = options.readOption('ocr');
            this.optionCountWas = options.readOption('count');
            this.renderScenario();
        }
    },

    onTabOptionsActive: function() {
        if (options.readOption('ocr')) {
            this.stopCamera();
        }
    },

    showOcr: function() {
        app.appElement.classList.add('ocr');
    },

    hideOcr: function() {
        app.appElement.classList.remove('ocr');
    },

    selectScenario: function(event) {
        const scenarioId = event.target.value;
        options.saveOption('scenarioId', scenarioId);
        this.scenario = this.getScenarioById(scenarioId);
        this.renderScenario();
    },

    getMonsterByOcr: function(name) {
        const slug = _s(name).slugify().value();
        return monsters.find(monster=>{
            return monster.getSlug() === slug;
        });
    },

    getScenarioById: function(id) {
        return scenarios.find(scenario => {
            return scenario.getId() === id;
        });
    },

    startCamera: function() {
        CameraPreview.startCamera({
            camera: CameraPreview.CAMERA_DIRECTION.BACK,
            width: this.previewWidth,
            height: this.previewHeight,
            toBack: true,
            disableExifHeaderStripping: true,
        }, (data)=>{
            this.onStartCamera(null, data);
        }, (e)=>{
            this.onStartCamera(e);
        });
    },

    onStartCamera: function(err, data) {
        if (err) {
            console.error(err);
            return;
        }
        this.isCameraActive = true;
        this.takeSnapshot();
    },

    stopCamera: function() {
        CameraPreview.stopCamera((data)=>{
            this.onStopCamera(null, data);
        }, (e)=>{
            this.onStopCamera(e);
        });
    },

    onStopCamera: function(err, data) {
        if (err) {
            console.error(err);
            return;
        }
        this.isCameraActive = false;
    },
    
    takeSnapshot: function(callback) {
        
        if (!this.isCameraActive) return;

        CameraPreview.takeSnapshot({

        }, (base64PictureData) => {
            textocr.recText(4, base64PictureData, (data) => {
                this.onOcr(null, data, base64PictureData);
            }, (err) => {
                this.onOcr(err);
            });
        }, console.error);
    },

    onOcr: function(err, data, base64PictureData) {

        const image = new Image();
        image.onload = () => { window.requestAnimationFrame(()=>{this.renderResult(err, data, image)}); }
        image.src = 'data:image/jpeg;base64,' + base64PictureData;

    },

    renderResult: function(err, data, image) {

        if (err) {
            console.error(err);
            return;
        }

        const ocrTextElement  = this.ocrTextElement;
        // const ocrBlockElement = this.ocrBlockElement;
        const snapshotElement = this.snapshotElement;
        // const style           = ocrBlockElement.style;

        if (!data.foundText) {
            // text not found
            // style.top = -10;
            // style.left = -10;
            // style.width = 0;
            // style.height = 0;
            
            ocrTextElement.innerHTML = l('DEFAULT_OCR_TEXT');

            ocrTextElement.classList.remove('match-yes');
            ocrTextElement.classList.remove('match-no');
            
            this.takeSnapshot();
            return;
        }

        // text found

        const blocks       = data.blocks;
        const blockframe   = blocks.blockframe[0];
        
        const ocrText      = blocks.blocktext[0].split('\n')[0];
        // const ocrSlug      = _s(ocrText).slugify().value();

        // const [iw, ih]     = [image.width, image.height];               // image
        // const [pw, ph]     = [this.previewWidth, this.previewHeight];   // preview
        // const [vw, vh]     = [window.innerWidth, window.innerHeight];   // viewport
        
        // android method - https://stackoverflow.com/questions/39190145/can-i-get-the-status-bar-height-and-apply-it-to-html
        // const portraitVH   = 3.90625;
        // const landscapeVH  = 6.94444;
        // const AndroidStatusBar    = vh / 100 * portraitVH;

        // style.left         = ( blockframe.x      / iw * pw             ) + 'px';
        // style.top          = ( (blockframe.y )   / ih * ph  - AndroidStatusBar ) + 'px';
        // style.width        = ( blockframe.width  / iw * pw             ) + 'px';
        // style.height       = ( blockframe.height / ih * ph             ) + 'px';

        const monster = this.getMonsterByOcr(ocrText);
        const inDatabase = !!monster;

        if (!inDatabase) {
            // not a game monster name
            ocrTextElement.innerHTML = ocrText;

            ocrTextElement.classList.remove('match-yes');
            ocrTextElement.classList.remove('match-no');
            this.takeSnapshot();
            return;
        }

        // it's a game monster name

        ocrTextElement.innerHTML = monster.getName();

        const scenario = this.scenario;

        const inScenario = scenario.hasMonster(monster);

        let soundDuration = 0;

        if (!inScenario) {
            // not a scenario monster name
            soundDuration = this.sound('ko');
            ocrTextElement.classList.remove('match-yes');
            ocrTextElement.classList.add('match-no');
            
        } else {
             // it's a scenario monster name
            soundDuration = this.sound('ok');
            ocrTextElement.classList.add('match-yes');
            ocrTextElement.classList.remove('match-no');
            if (options.readOption('count')) scenario.count(monster, this.monsterListELement);
        }

        // const snapStyle = snapshotElement.style;
        // // snapStyle.backgroundImage = `url("${image.src}")`;
        // // snapStyle.display = 'block';

        // snapStyle.opacity = 1;
        // snapStyle.transitionDelay = 2000 + "ms";
        // snapStyle.opacity = 0;
        // setTimeout(()=>{ snapStyle.transitionDelay = 0; }, 2000);

        setTimeout(()=>{
            this.takeSnapshot();
            // snapStyle.display = 'none';
        }, soundDuration);

    },

    renderScenario: function() {
        let scenarioName = '';
        let monsterList = '';
        if (this.scenario) {
            scenarioName = this.scenario.getName();
            monsterList = options.readOption('group') ? this.scenario.getGroupedHTML() : this.scenario.getFlatHTML();
        }
        this.scenarioNameElement.innerHTML = scenarioName;
        this.monsterListELement.innerHTML = monsterList;
        this.applyCountOption();
    },

    applyCountOption: function() {
        const action = options.readOption('count') ? 'add' : 'remove';
        this.monstersContentElement.classList[action]('count');
    },

    sound: function(q, loop) {
        const mediaWrapper = this.sounds[q];
        const media = mediaWrapper.media;
        if (options.readOption('sound')) {
            media.play();
            // if (loop) setInterval(() => { media.stop(); media.play(); }, loop);
        }
        return mediaWrapper.duration;
    },

};

app.initialize();