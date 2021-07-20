var _s = s;
var app_started = new Date();

function isBrowser() {
    return device.platform === 'browser';
}

function isAndroid() {
    if (!isBrowser()) return device.platform === "Android";
    return !!navigator.userAgent.match(/Android/);
}

function isIOS() {
    if (!isBrowser()) device.platform === "iOS";
    return !!( navigator.userAgent.match(/iPhone/) || navigator.userAgent.match(/iPad/) );
}

function isDesktop() {
    return !isMobile();
}

function isMobile() {
    if (isAndroid()) return true;
    if (isIOS()) return true;
    const platform = device.platform;
    if (platform === 'WinCE') return true;
    if (platform === 'Tizen') return true;
    if (platform === 'BlackBerry 10') return true;
    return false;
}

function filePath(path) {
    return ( isAndroid() ? "/android_asset/www" : "" ) + path;
}

function setPseudoElContent(selector, value) {    
    document.styleSheets[0].addRule(selector, 'content: "' + value + '";');
}

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

function makeSelector(options) {

    options = _.defaults(options, {
        element: null,
        options: [],
        value: null,
        onChange: '',
        trigger: true,
    });

    const selectorElement  = options.element;
    const selectorOptions  = options.options;
    const selectedValue    = (_.isUndefined(options.value) || _.isNull(options.value)) ? selectorElement.value : options.value;
    const onChangeFuncPath = options.onChange;
    const triggerChange    = options.trigger;
    
    selectorElement.classList.add('selector');
    selectorElement.classList.add('hidden-selector');
    selectorElement.setAttribute('data-onchange', onChangeFuncPath);

    const linkElement = document.createElement('span');
    linkElement.classList.add('hidden-selector-link');
    selectorElement.parentNode.appendChild(linkElement);

    const styleElement = document.createElement('style');
    styleElement.id = selectorElement.id + '-style';
    document.querySelector('head').appendChild(styleElement);

    if (isBrowser()) {

        linkElement.addEventListener('click', (ev) => {
            selectorElement.setAttribute('size', selectorElement.options.length);
            selectorElement.classList.remove('hidden-selector');
            selectorElement.classList.add('browser-selector');
            selectorOverlay(selectorElement, true);
        });

        selectorElement.addEventListener('click', (ev) => {
            const target = ev.target;
            if (target.tagName.toLowerCase() !== 'option') return;
            if (!target.selected) return;
            selectorElement.dispatchEvent(new Event('change'));
        });

        selectorElement.addEventListener('change', () => {
            selectorElement.classList.remove('browser-selector');
            selectorElement.classList.add('hidden-selector');
            linkElement.textContent = selectorElement.options[selectorElement.selectedIndex].text;

            selectorOverlay(selectorElement, false);

            document.getElementById(`${selectorElement.id}-style`).innerHTML = `
                #${selectorElement.id} option:nth-child(${selectorElement.selectedIndex + 1})::before {
                    content: "${selectorElement.options[selectorElement.selectedIndex].text}";
                }
            `;

        });

    } else {

        linkElement.addEventListener('click', (ev) => {
            var e = document.createEvent('MouseEvents');
            e.initMouseEvent('mousedown', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            selectorElement.dispatchEvent(e);
        });
    
        selectorElement.addEventListener('change', () => {
            linkElement.textContent = selectorElement.options[selectorElement.selectedIndex].text;
        });
    
    }

    populateSelector(options);

}

function populateSelector(options) {

    options = _.defaults(options, {
        element: null,
        options: [],
        value: null,
        onChange: '',
        trigger: true,
    });

    if (!_.has(options.element.dataset, 'onchange')) throw new Error("Elemento non inizializzato");

    const selectorElement  = options.element;
    const selectorOptions  = options.options;
    const selectedValue    = (_.isUndefined(options.value) || _.isNull(options.value)) ? selectorElement.value : options.value;
    const onChangeFuncPath = options.onChange;
    const triggerChange    = options.trigger;

    // individua la funzione onchange
    let funcPath = onChangeFuncPath || selectorElement.getAttribute('data-onchange');
    funcPath = funcPath.split('.');
    const that = _.get(window, funcPath[0]);
    const func = _.get(window, funcPath).bind(that);
    
    // rimuovi il listener onchange
    selectorElement.removeEventListener('change', func);

    // svuota le options
    let i = selectorElement.length;
    while (i--) selectorElement.remove(i);

    // aggiungi le options
    selectorOptions.sort((a, b) => a[0].localeCompare(b[0], this.lang));
    selectorOptions.forEach(so => {
        const [ text, value ] = so;
        selectorElement.add(new Option(text, value));
    });

    // setta la option
    selectorElement.value = selectedValue;

    // se la option non esiste più, setta la prima
    if (selectorElement.selectedIndex === -1) selectorElement.selectedIndex = 0;

    // setta il testo del link
    const linkElement = selectorElement.parentNode.querySelector('span');
    linkElement.textContent = selectorElement.options[selectorElement.selectedIndex].text;

    selectorElement.addEventListener('change', func);

    if (triggerChange) selectorElement.dispatchEvent(new Event('change'));

}

function renameSelectorOptions(options) {

    options = _.defaults(options, {
        element: null,
        options: [],
    });

    const selectorElement  = options.element;
    const selectorOptions  = options.options;

    selectorOptions.sort((a, b) => a[0].localeCompare(b[0], app.lang));

    _.each(selectorElement.options, opt => {
        const match = _.find(selectorOptions, pair => pair[1] === opt.value);
        if (match) opt.text = match[0];
    });
    
    const $selectorElement = $(selectorElement);
    
    selectorOptions.forEach(pair => {
        const [ text, value ] = pair;
        const optionElement = Array.from(selectorElement.options).find(optEl => optEl.value === value);
        $selectorElement.append(optionElement);
    });

    if (!_.has(selectorElement.dataset, 'onchange')) return;

    const linkElement = selectorElement.parentNode.querySelector('span');
    if (selectorElement.selectedIndex !== -1) {
        linkElement.textContent = selectorElement.options[selectorElement.selectedIndex].text;
    } else {
        linkElement.textContent = '';
    }
}

function selectorOverlay(selectorElement, show) {

    const parentTab = $(selectorElement).closest('.app-ui-tab').get(0);
    let overlayElement = parentTab.querySelector('.browser-selector-overlay');

    if (!overlayElement) {

        overlayElement = document.createElement('div');
        overlayElement.classList.add('browser-selector-overlay');
        overlayElement.style.display = 'none';
        // parentTab.insertBefore(overlayElement, parentTab.children[0]);
        parentTab.appendChild(overlayElement);

        overlayElement.addEventListener('click', ($ev) => {
            selectorElement.dispatchEvent(new Event('change'));
        });

    }

    let tabBar = document.getElementById('tab-bar');
    
    if (show) {
        overlayElement.style.display = 'block';
        tabBar.style.pointerEvents = 'none';
        tabBar.style.opacity = 0.7;
    } else {
        overlayElement.style.display = 'none' ;
        tabBar.style.pointerEvents = 'auto';
        tabBar.style.opacity = 1;
    }

}

function l(str) {
    const len = arguments.length;
    str = app.currentLanguage.getString(str);
    for (let i = len - 1; i > 0; i--) {
        str = str.split('%' + i).join(arguments[i]);
    }
    return str;
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

    setLang: function(langId) {
        this.lang = langId;
        this.currentLanguage = _.find(languages, language => language.getId() === langId);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {

        const defaultLang = _.find(languages, language => language.isDefault());
        navigator.globalization.getLocaleName((locale) => {
            const currentLang = locale.value.split(',')[0].split('-')[0];
            const supportedLang = _.find(languages, language => language.getId() === currentLang);
            this.setLang(supportedLang ? supportedLang.getId() : defaultLang.getId());
            this.prepareApp();
        }, (e) => {
            console.error(e);
            this.setLang(defaultLang.getId());
            this.prepareApp();
        });

    },

    prepareApp: function() {

        this.appElement               = document.getElementById('app');
        
        // this.snapshotElement          = document.getElementById('snapshot');
        this.ocrBlockElement          = document.getElementById('card-ocr-block');
        this.monstersContentElement   = document.getElementById('app-ui');
        this.optionsContentElement    = document.getElementById('app-options');

        this.ocrTextElement           = document.getElementById('card-name');
        this.monsterListELement       = document.getElementById('monster-list');
        this.scenarioSelector         = document.getElementById('scenario-selector');
        // this.scenarioNameElement      = document.getElementById('scenario-name');

        this.ocrTextElement.innerHTML = l('DEFAULT_OCR_TEXT');

        // const filepathBG              = filePath("/sounds/bg.wav");
        const filepathOK              = filePath("/sounds/match-yes.mp3");
        const filepathKO              = filePath("/sounds/match-no.mp3");
        // mdls command in terminal to get file duration in seconds
        this.sounds.ok                = {media: new Media(filepathOK), duration: 3736};
        this.sounds.ko                = {media: new Media(filepathKO), duration: 3736};
        // this.sounds.bg                = {media: new Media(filepathBG), duration: };

        expansions = expansions.map(item => new Expansion(item));

        monsters = monsters.map(item => new Monster(item));
        
        scenarios = scenarios.map(item => new Scenario(item));

        options.initialize();

        this.onAppReady();
    },

    // Update DOM on a Received Event
    onAppReady: function() {

        this.appElement.style.visibility = 'visible';
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

        makeSelector({
            element: this.scenarioSelector,
            options: this.getAvailableScenarios().map(scenario => [scenario.getName(), scenario.getId()]),
            value: options.readOption('scenarioId'),
            onChange: 'app.selectScenario',
        });

        this.applyLanguage();

        (function hideSplashScreen() {
            if (new Date() - app_started < 2000 ) setTimeout(hideSplashScreen, 20);
            else navigator.splashscreen.hide();
        })();

    },

    applyLanguage: function() {

        // document.querySelector('html').className = this.lang;

        document.querySelectorAll('[data-lang]').forEach(element => {
            const str = element.getAttribute('data-lang');
            element.innerHTML = l(str);
        });

        renameSelectorOptions({
            element: this.scenarioSelector,
            options: this.getAvailableScenarios().map(scenario => [scenario.getName(), scenario.getId()]),
        });

    },

    onPause: function() {
        if (options.readOption('ocr')) this.stopCamera();
        this.sounds.ok.media.stop();
        this.sounds.ko.media.stop();
    },

    onResume: function() {
        if (options.readOption('ocr')) this.startCamera();
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

    getAvailableScenarios: function() {
        return _.filter(scenarios, scenario => options.isExpansionAvailable(scenario));
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
        // const snapshotElement = this.snapshotElement;
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
        // let scenarioName = '';
        let monsterList = '';
        if (this.scenario) {
            // scenarioName = this.scenario.getName();
            monsterList = options.readOption('group') ? this.scenario.getGroupedHTML() : this.scenario.getFlatHTML();
        }
        // this.scenarioNameElement.innerHTML = scenarioName;
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