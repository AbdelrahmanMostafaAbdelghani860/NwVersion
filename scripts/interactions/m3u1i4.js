const canvas = document.getElementById('interaction');
const ctx = canvas.getContext('2d');

// functions for accessing css values
function getDefaultShapeColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-shape-color");
}
function getDefaultSecondaryColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-secondary-color");
}
function getDefaultBGColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-bg-color");
}

// otherwise canvas resolution scales too low
canvas.width = window.innerWidth;
canvas.height = canvas.width/2; // alternatively: = window.innerHeight

let FPS = 30;

init();

// SLIDERS

interframeIntervalSlider = document.getElementById('interframeInterval');
interframeIntervalSlider.oninput = function() {
    interframeInterval = parseInt(this.value);
    saveSettings();
}
interframeIntervalSlider.value = interframeInterval;

let colorChangeButton = document.getElementById('colorChange');
colorChangeButton.onclick = function () {
    toggleColor();
    saveSettings();
    setActiveColorButton(); // Setze oder entferne die aktive Markierung
};

// Funktion zum Setzen/Entfernen der aktiven Markierung
function setActiveColorButton() {
    if (colorChanged) {
        colorChangeButton.classList.add("active-button");
    } else {
        colorChangeButton.classList.remove("active-button");
    }
}

startButton = document.getElementById('start');
startButton.onclick = function() {
    toggleStarted();
}

function toggleColor() {
    colorChanged = !colorChanged;
    if (colorChanged) {
        colorChangeButton.value = '  ';
    } else {
        colorChangeButton.value = '  ';
    }
}

function toggleStarted() {
    started = !started;
    if (started) {
        startButton.value = '⏸';
    } else {
        startButton.value = '⏵';
    }
}

// KEY INPUT

window.addEventListener('keydown', function(k) {
    switch (k.keyCode) {
        case 69: // e key
            toggleStarted();
            break;
        case 81: // q key
            toggleColor();
            saveSettings();
            break;
        case 87: // w key
            interframeInterval += 10;
            if (interframeInterval > 1000) {
                interframeInterval = 1000;
            }
            interframeIntervalSlider.value = interframeInterval;
            saveSettings();
            break;
        case 83: // s key
            interframeInterval -= 10;
            if (interframeInterval < 100) {
                interframeInterval = 100;
            }
            interframeIntervalSlider.value = interframeInterval;
            saveSettings();
            break;
    }
});

loadSettings();

let then = Date.now();
animate();

// initializes all necessary global variables to default values
function init() {
    interframeInterval = 500;
    circsize = 50;
    colorChanged = false;
    started = false;
    inChange = false;
    visibilitySwitched = false;
    interframeTimer = Date.now();
}

function reset() {
    interframeInterval = 500;
    interframeIntervalSlider.value = interframeInterval;
    circsize = 50;
    saveSettings();
}

function loadSettings() {
    // loaded from Session Storage if available
    if (sessionStorage.getItem('settings') != '') {
        var paramList = sessionStorage.getItem('settings').split('&');
        if (paramList.length == 4) {
            FPS = parseInt(paramList[0].split('=')[1]);
            interframeInterval = parseInt(paramList[1].split('=')[1]);
            interframeIntervalSlider.value = interframeInterval;
            circsize = parseInt(paramList[2].split('=')[1]);
            colorChanged = paramList[3].split('=')[1] === 'true';
        }
    }
}

function saveSettings() {
    sessionStorage.setItem('settings', 'fps=' + FPS + '&interframeInterval=' + interframeInterval + '&circsize=' + circsize + '&colorChanged=' + colorChanged);
}

// all drawing (and per frame logic) in here
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultShapeColor();
    
    if (started && Date.now() - interframeTimer > interframeInterval) {
        visibilitySwitched = !visibilitySwitched;
        interframeTimer = Date.now();
    }
        
    if (visibilitySwitched) {
        ctx.beginPath();
        ctx.arc(2/3*canvas.width, 0.5*canvas.height, 0.005*circsize*canvas.height, 0, 2*Math.PI);
        ctx.fill();
    } else {
        if (colorChanged) {
            ctx.fillStyle = getDefaultSecondaryColor();
        }
        ctx.beginPath();
        ctx.arc(1/3*canvas.width, 0.5*canvas.height, 0.0025*circsize*canvas.height, 0, 2*Math.PI);
        ctx.fill();
    }
}


function animate() {
    requestAnimationFrame(animate);
    
    now = Date.now();
    elapsed = now - then;
        
    if (elapsed > (1000 / FPS)) {
        then = now;
        draw();
    }
}
