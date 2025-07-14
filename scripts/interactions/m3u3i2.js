const canvas = document.getElementById('interaction');
const ctx = canvas.getContext('2d');

// functions for accessing css values
function getDefaultShapeColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-shape-color");
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

startButton = document.getElementById('start');
startButton.onclick = function() {
    toggleStarted();
}

function toggleStarted() {
    started = !started;
    if (started) {
        startButton.value = '⏸';
    } else {
        startButton.value = '⏵';
    }
}

dottedButton = document.getElementById('dotted');
dottedButton.onclick = setDotted;

function setDotted() {
    dotted = true;
    updateDottedButtons();
    saveSettings();
}

plainButton = document.getElementById('plain');
plainButton.onclick = setPlain;

function setPlain() {
    dotted = false;
    updateDottedButtons();
    saveSettings();
}

function updateDottedButtons() {
    if (dotted) {
        dottedButton.disabled = true;
        plainButton.disabled = false;
    } else {
        dottedButton.disabled = false;
        plainButton.disabled = true;
    }
}

// KEY INPUT

window.addEventListener('keydown', function(k) {
    switch (k.keyCode) {
        case 49: // 1 key
            setDotted();
            break;
        case 50: // 2 key
            setPlain();
            break;
        case 69: // e key
            toggleStarted();
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
updateDottedButtons();

let then = Date.now();
animate();

// initializes all necessary global variables to default values
function init() {
    interframeInterval = 500;
    started = false;
    visibilitySwitched = false;
    interframeTimer = Date.now();
    dotted = false;
    
}

function reset() {
    interframeInterval = 500;
    interframeIntervalSlider.value = interframeInterval;
    dotted = false;
    saveSettings();
}

function loadSettings() {
    // loaded from Session Storage if available
    if (sessionStorage.getItem('settings') != '') {
        var paramList = sessionStorage.getItem('settings').split('&');
        if (paramList.length == 3) {
            FPS = parseInt(paramList[0].split('=')[1]);
            interframeInterval = parseInt(paramList[1].split('=')[1]);
            interframeIntervalSlider.value = interframeInterval;
            dotted = parseInt(paramList[2].split('=')[1]) == 1;
            updateDottedButtons();
        }
    }
}

function saveSettings() {
    sessionStorage.setItem('settings', 'fps=' + FPS + '&interframeInterval=' + interframeInterval + '&dotted=' + (0 + dotted));
}

// logic helper functions

// all drawing (and per frame logic) in here
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultShapeColor();
    ctx.strokeStyle = getDefaultShapeColor();
    
    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 2; j++) {
            ctx.beginPath();
            ctx.arc(i*canvas.width/4-canvas.width/8, j*canvas.height/2-canvas.height/4, canvas.height/8, 0, 2*Math.PI);
            ctx.fill();
        }
    }
    
    if (started && Date.now() - interframeTimer > interframeInterval) {
        visibilitySwitched = !visibilitySwitched;
        interframeTimer = Date.now();
    }
    
    ctx.fillStyle = getDefaultBGColor();
    ctx.strokeStyle = getDefaultBGColor();
    
    if (visibilitySwitched) {
        ctx.fillRect(3*canvas.width/4-canvas.width/8, canvas.height/2-canvas.height/4, canvas.width/4, canvas.height/2);
    } else {
        ctx.fillRect(canvas.width/4-canvas.width/8, canvas.height/2-canvas.height/4, canvas.width/4, canvas.height/2);
    }
    
    if (dotted) {
        ctx.fillStyle = getDefaultShapeColor();
        ctx.strokeStyle = getDefaultShapeColor();
        for (let i = 1; i <= 100; i++) {
            for (let j = 1; j <= 50; j+=2) {
                ctx.fillRect(i*canvas.width/100-canvas.width/200, (j+(i%2))*canvas.height/50-canvas.height/100, canvas.width/400, canvas.height/200);
            }
        }
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
