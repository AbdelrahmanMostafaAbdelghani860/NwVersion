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

circs = [[0.1, 0.15], [0.15, 0.5], [0.25, 0.1], [0.3, 0.4], [0.35, 0.9], [0.45, 0.2], [0.5, 0.6], [0.7, 0.35], [0.75, 0.8]];

init();

// SLIDERS & BUTTONS

interframeIntervalSlider = document.getElementById('interframeInterval');
interframeIntervalSlider.oninput = function() {
    interframeInterval = parseInt(this.value);
    saveSettings();
}
interframeIntervalSlider.value = interframeInterval;

startButton = document.getElementById('start');
startButton.onclick = function () {
    toggleStarted();
};

function toggleStarted() {
    started = !started;
    if (started) {
        startButton.value = '⏸';
    } else {
        startButton.value = '⏵';
    }
}

signButton = document.getElementById('sign');
signButton.onclick = function () {
    toggleBox();
};

function setActiveButton(button) {
    button.classList.add("active-button");
}

// Funktion zum Entfernen des aktiven Status
function removeActiveButton(button) {
    button.classList.remove("active-button");
}

function toggleBox() {
    box = !box;
    if (box) {
        setActiveButton(signButton);
    } else {
        removeActiveButton(signButton);
    }
    saveSettings();
}

// KEY INPUT

window.addEventListener('keydown', function(k) {
    switch (k.keyCode) {
        case 69: // e key
            toggleStarted();
            break;
        case 81: // q key
            toggleBox();
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
    started = false;
    box = false;
    inChange = false;
    visibilitySwitched = false;
    interframeTimer = Date.now();
    circsize = 10;
}

function reset() {
    interframeInterval = 500;
    interframeIntervalSlider.value = interframeInterval;
    circsize = 10;
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
            circsize = parseInt(paramList[2].split('=')[1]);
            if (box) {
                setActiveButton(signButton);
            } else {
                removeActiveButton(signButton);
            }
        }
    }
}

function saveSettings() {
    sessionStorage.setItem('settings', 'fps=' + FPS + '&interframeInterval=' + interframeInterval + '&circsize=' + circsize);
}

// logic helper functions

// all drawing (and per frame logic) in here
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultShapeColor();
    ctx.strokeStyle = getDefaultShapeColor();
    
    if (started && Date.now() - interframeTimer > interframeInterval) {
        visibilitySwitched = !visibilitySwitched;
        interframeTimer = Date.now();
    }
    
    if (visibilitySwitched) {
        for (let i = 0; i < circs.length; i++) {
            ctx.beginPath();
            ctx.arc(circs[i][0]*canvas.width+canvas.width/5, circs[i][1]*canvas.height, 0.005*circsize*canvas.height, 0, 2*Math.PI);
            ctx.fill();
        }
    } else {
        for (let i = 0; i < circs.length; i++) {
            ctx.beginPath();
            ctx.arc(circs[i][0]*canvas.width, circs[i][1]*canvas.height, 0.005*circsize*canvas.height, 0, 2*Math.PI);
            ctx.fill();
        }
    }
    
    if (box) {
        ctx.beginPath();
        ctx.fillRect(0.5*canvas.width-0.01*circsize*canvas.height+canvas.width/5, 0.6*canvas.height-0.01*circsize*canvas.height, 0.02*circsize*canvas.height, canvas.height);
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
