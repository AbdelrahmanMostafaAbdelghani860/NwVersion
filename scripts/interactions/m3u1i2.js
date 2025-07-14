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

distanceSlider = document.getElementById('distance');
distanceSlider.oninput = function() {
    distance = parseInt(this.value);
    inChange = true;
    lastChange = Date.now();
    saveSettings();
}
distanceSlider.value = distance;

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

// KEY INPUT

window.addEventListener('keydown', function(k) {
    switch (k.keyCode) {
        case 69: // e key
            toggleStarted();
            break;
        case 65: // a key
            distance -= 1;
            if (distance < 0) {
                distance = 0;
            }
            inChange = true;
            lastChange = Date.now();
            distanceSlider.value = distance;
            saveSettings();
            break;
        case 68: // d key
            distance += 1;
            if (distance > 100) {
                distance = 100;
            }
            inChange = true;
            lastChange = Date.now();
            distanceSlider.value = distance;
            saveSettings();
            break;s
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
    distance = 50;
    circsize = 20;
    started = false;
    inChange = false;
    visibilitySwitched = false;
    lastChange = 0;
    interframeTimer = Date.now();
}

function reset() {
    interframeInterval = 500;
    interframeIntervalSlider.value = interframeInterval;
    distance = 50;
    distanceSlider.value = distance;
    circsize = 20;
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
            distance = parseInt(paramList[2].split('=')[1]);
            distanceSlider.value = distance;
            circsize = parseInt(paramList[3].split('=')[1]);
        }
    }
}

function saveSettings() {
    sessionStorage.setItem('settings', 'fps=' + FPS + '&interframeInterval=' + interframeInterval + '&distance=' + distance + '&circsize=' + circsize);
}

// all drawing (and per frame logic) in here
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultShapeColor();
    
    if (!started) {
        ctx.beginPath();
        ctx.arc(0.5*canvas.width+0.005*distance*canvas.width, canvas.height/3, 0.005*circsize*canvas.height, 0, 2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0.5*canvas.width+0.005*distance*canvas.width, 2*canvas.height/3, 0.005*circsize*canvas.height, 0, 2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0.5*canvas.width-0.005*distance*canvas.width, canvas.height/3, 0.005*circsize*canvas.height, 0, 2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0.5*canvas.width-0.005*distance*canvas.width, 2*canvas.height/3, 0.005*circsize*canvas.height, 0, 2*Math.PI);
        ctx.fill();
        return;
    }
    
    if (lastChange + 1000 > Date.now()) {
        ctx.beginPath();
        ctx.arc(0.5*canvas.width+0.005*distance*canvas.width, canvas.height/3, 0.005*circsize*canvas.height, 0, 2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0.5*canvas.width+0.005*distance*canvas.width, 2*canvas.height/3, 0.005*circsize*canvas.height, 0, 2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0.5*canvas.width-0.005*distance*canvas.width, canvas.height/3, 0.005*circsize*canvas.height, 0, 2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0.5*canvas.width-0.005*distance*canvas.width, 2*canvas.height/3, 0.005*circsize*canvas.height, 0, 2*Math.PI);
        ctx.fill();
        inChange = false;
        interframeTimer = Date.now();
        return;
    }
    
    if (Date.now() - interframeTimer > interframeInterval) {
        visibilitySwitched = !visibilitySwitched;
        interframeTimer = Date.now();
    }
        
    if (visibilitySwitched) {
        ctx.beginPath();
        ctx.arc(0.5*canvas.width+0.005*distance*canvas.width, canvas.height/3, 0.005*circsize*canvas.height, 0, 2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0.5*canvas.width+0.005*distance*canvas.width, 2*canvas.height/3, 0.005*circsize*canvas.height, 0, 2*Math.PI);
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.arc(0.5*canvas.width-0.005*distance*canvas.width, canvas.height/3, 0.005*circsize*canvas.height, 0, 2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0.5*canvas.width-0.005*distance*canvas.width, 2*canvas.height/3, 0.005*circsize*canvas.height, 0, 2*Math.PI);
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
