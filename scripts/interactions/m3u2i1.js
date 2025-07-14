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


retrainButtonContainer = document.getElementById('retrainButtonContainer');
button150Container = document.getElementById('button150Container');
button130Container = document.getElementById('button130Container');
testButtonContainer = document.getElementById('testButtonContainer');
resetButtonContainer = document.getElementById('resetButtonContainer');

let FPS = 30;
let phase = 0;

let textfieldKeys = ['instructions', 'instructions2', 'instructions3'];
textfield = document.getElementById('textfield');

init();

// SLIDERS

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

retrainButton = document.getElementById('retrain');
retrainButton.onclick = function () {
    removeActiveButtons();
    nextPhase();
};

// Funktion zum Wechseln des aktiven Buttons
function setActiveButton(button) {
    removeActiveButtons(); // Entfernt vorherige Markierungen
    button.classList.add("active-button");
}

// Funktion zum Entfernen des aktiven Status für alle Buttons
function removeActiveButtons() {
    button150.classList.remove("active-button");
    button130.classList.remove("active-button");
    testButton.classList.remove("active-button");
}


function nextPhase() {
    setPhase((phase + 1) % 3);
}

function setPhase(newPhase) {
    phase = newPhase;
    textfield.textContent = languages[localStorage.getItem('lang')][textfieldKeys[phase]];
    switch(phase) {
        case 0:
            retrainButtonContainer.style.setProperty('display', 'inline');
            button150Container.style.setProperty('display', 'none');
            button130Container.style.setProperty('display', 'none');
            testButtonContainer.style.setProperty('display', 'none');
            resetButtonContainer.style.setProperty('display', 'none');
            break;
        case 1:
            f150();
        case 2:
            retrainButtonContainer.style.setProperty('display', 'none');
            button150Container.style.setProperty('display', 'inline');
            button130Container.style.setProperty('display', 'inline');
            testButtonContainer.style.setProperty('display', 'inline');
            resetButtonContainer.style.setProperty('display', 'inline');
            break;
    }
    saveSettings();
}

button150 = document.getElementById('b150');
button150.onclick = function () {
    setActiveButton(button150);
    angle = 150;
    saveSettings();
    draw();
};

function f150() {
    switch(phase) {
        case 0:
            break;
        case 1:
        case 2:
            angle = 150;
            break;
    }
    saveSettings();
};

button130 = document.getElementById('b130');
button130.onclick = function () {
    setActiveButton(button130);
    angle = 130;
    saveSettings();
    draw();
};

function f130() {
    switch(phase) {
        case 0:
            break;
        case 1:
        case 2:
            angle = 130;
            break;
    }
    saveSettings();
};

testButton = document.getElementById('test');
testButton.onclick = function () {
    setActiveButton(testButton);
    angle = 60;
    saveSettings();
    draw();
};

function testButtonFunction() {
    switch(phase) {
        case 0:
            break;
        case 1:
            nextPhase();
            angle = 60;
            break;
        case 2:
            angle = 60;
            break;
    }
    saveSettings();
}

resetButton = document.getElementById('reset');
resetButton.onclick = function () {
    removeActiveButtons();
    setPhase(0);
};

function resetButtonFunction() {
    switch(phase) {
        case 0:
            break;
        case 1:
            setPhase(0);
        case 2:
            setPhase(0);
            break;
    }
    saveSettings();
}

// KEY INPUT

window.addEventListener('keydown', function(k) {
    switch (k.keyCode) {
        case 49: // 1 key
            f150();
            break;
        case 50: // 2 key
            f130();
            break;
        case 69: // e key
            toggleStarted();
            break;
        case 81: // q key
            switch(phase) {
                case 0:
                    nextPhase();
                    break;
                case 1:
                case 2:
                    testButtonFunction();
                    break;
            }
            break;
        case 82: // r key
            resetButtonFunction();
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
    phase = 0;
    interframeInterval = 500;
    linewidth = 10;
    angle = 150;
    started = false;
    inChange = false;
    visibilitySwitched = false;
    interframeTimer = Date.now();
}

function reset() {
    phase = 0;
    interframeInterval = 500;
    interframeIntervalSlider.value = interframeInterval;
    linewidth = 10;
    angle = 150;
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
            linewidth = parseInt(paramList[2].split('=')[1]);
            angle = parseInt(paramList[3].split('=')[1]);
        }
    }
}

function saveSettings() {
    sessionStorage.setItem('settings', 'fps=' + FPS + '&interframeInterval=' + interframeInterval + '&linewidth=' + linewidth + '&angle=' + angle);
}

// logic helper functions
function xFromAngle(angle, length) {
    return Math.cos((Math.PI / 180.0) * angle) * length;
}

function yFromAngle(angle, length) {
    return Math.sin((Math.PI / 180.0) * angle) * length;
}

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
    
    switch(phase) {
        case 0:
            ctx.lineWidth = linewidth;
            if (visibilitySwitched) {
                ctx.beginPath();
                ctx.moveTo(0.45*canvas.width, 0.6*canvas.height);
                ctx.lineTo(0.45*canvas.width+xFromAngle(180+60, 0.4*canvas.height), 0.6*canvas.height+yFromAngle(180+60, 0.4*canvas.height));
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(0.2*canvas.width, 0.6*canvas.height);
                ctx.lineTo(0.8*canvas.width, 0.6*canvas.height);
                ctx.stroke();
            }
            break;
        case 1:
        case 2:
            ctx.lineWidth = linewidth;
            if (visibilitySwitched) {
                ctx.beginPath();
                ctx.moveTo(0.45*canvas.width, 0.6*canvas.height);
                ctx.lineTo(0.45*canvas.width+xFromAngle(180+angle, 0.4*canvas.height), 0.6*canvas.height+yFromAngle(180+angle, 0.4*canvas.height));
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(0.2*canvas.width, 0.6*canvas.height);
                ctx.lineTo(0.8*canvas.width, 0.6*canvas.height);
                ctx.stroke();
            }
            break;
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
