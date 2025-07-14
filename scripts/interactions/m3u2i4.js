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

// SLIDERS & BUTTONS

interframeIntervalSlider = document.getElementById('interframeInterval');
interframeIntervalSlider.oninput = function() {
    interframeInterval = parseInt(this.value);
    saveSettings();
}
interframeIntervalSlider.value = interframeInterval;

startButton = document.getElementById('start');
startButton.onclick = toggleStarted;

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
    inChange = false;
    visibilitySwitched = false;
    interframeTimer = Date.now();
    circsize = 10;
    distance = 10;
}

function reset() {
    interframeInterval = 500;
    interframeIntervalSlider.value = interframeInterval;
    circsize = 10;
    distance = 10;
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
            distance = parseInt(paramList[3].split('=')[1]);
        }
    }
}

function saveSettings() {
    sessionStorage.setItem('settings', 'fps=' + FPS + '&interframeInterval=' + interframeInterval + '&circsize=' + circsize + '&distance=' + distance);
}

// logic helper functions

// all drawing (and per frame logic) in here
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultShapeColor();
    ctx.strokeStyle = getDefaultShapeColor();
    
    if (!started) {
        ctx.beginPath();
        ctx.fillRect(1/2*canvas.width+distance/100*canvas.width-0.0075*circsize*canvas.height, 1/2*canvas.height+distance/100*canvas.height-0.0075*circsize*canvas.height, 0.015*circsize*canvas.height, canvas.height);
        ctx.beginPath();
        ctx.arc(1/2*canvas.width+distance/100*canvas.width, 1/2*canvas.height-distance/100*canvas.height, 0.005*circsize*canvas.height, 0, 2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(1/2*canvas.width-distance/100*canvas.width, 1/2*canvas.height-distance/100*canvas.height, 0.005*circsize*canvas.height, 0, 2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(1/2*canvas.width-distance/100*canvas.width, 1/2*canvas.height+distance/100*canvas.height, 0.005*circsize*canvas.height, 0, 2*Math.PI);
        ctx.fill();
    }
    
    if (started && Date.now() - interframeTimer > interframeInterval) {
        visibilitySwitched = !visibilitySwitched;
        interframeTimer = Date.now();
    }
    
    if (visibilitySwitched) {
        ctx.beginPath();
        ctx.arc(1/2*canvas.width+distance/100*canvas.width, 1/2*canvas.height-distance/100*canvas.height, 0.005*circsize*canvas.height, 0, 2*Math.PI);
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.arc(1/2*canvas.width-distance/100*canvas.width, 1/2*canvas.height-distance/100*canvas.height, 0.005*circsize*canvas.height, 0, 2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(1/2*canvas.width-distance/100*canvas.width, 1/2*canvas.height+distance/100*canvas.height, 0.005*circsize*canvas.height, 0, 2*Math.PI);
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
