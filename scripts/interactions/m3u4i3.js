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

velocitySlider1 = document.getElementById('velocity1');
velocitySlider1.oninput = function() {
    velocity1 = parseInt(this.value);
    applyVelocity();
    setResults(results);
    saveSettings();
}
velocitySlider1.value = velocity1;

velocitySlider2 = document.getElementById('velocity2');
velocitySlider2.oninput = function() {
    velocity2 = parseInt(this.value);
    applyVelocity();
    setResults(results);
    saveSettings();
}
velocitySlider2.value = velocity2;

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

resultsButton = document.getElementById('results');
resultsButton.onclick = toggleResults;

results1 = document.getElementById('results1');
results2 = document.getElementById('results2');

function applyVelocity() {
    if (xvel1 >= 0) {
        xvel1 = velocity1;
    } else {
        xvel1 = -velocity1;
    }
    if (yvel1 >= 0) {
        yvel1 = velocity1;
    } else {
        yvel1 = -velocity1;
    }
    if (xvel2 >= 0) {
        xvel2 = velocity2;
    } else {
        xvel2 = -velocity2;
    }
    if (yvel2 >= 0) {
        yvel2 = velocity2;
    } else {
        yvel2 = -velocity2;
    }
}

function toggleResults() {
    setResults(!results);
}

function setResults(value) {
    results = value;
    if (results) {
        resultsButton.value = '  ';
        results1.textContent = velocity1;
        results2.textContent = velocity2;
    } else {
        resultsButton.value = '  ';
        results1.textContent = '?';
        results2.textContent = '?';
    }
}

// KEY INPUT

window.addEventListener('keydown', function(k) {
    switch (k.keyCode) {
        case 65: // a key
            velocity1 -= 1;
            if (velocity1 < 1) {
                velocity1 = 1;
            }
            velocitySlider1.value = velocity1;
            applyVelocity();
            setResults(results);
            saveSettings();
            break;
        case 69: // e key
            toggleStarted();
            break;
        case 87: // w key
            velocity2 += 1;
            if (velocity2 > 48) {
                velocity2 = 48;
            }
            velocitySlider2.value = velocity2;
            applyVelocity();
            setResults(results);
            saveSettings();
            break;
        case 81: // q key
            velocity1 += 1;
            if (velocity1 > 48) {
                velocity1 = 48;
            }
            velocitySlider1.value = velocity1;
            applyVelocity();
            setResults(results);
            saveSettings();
            break;
        case 82: // r key
            toggleResults();
            break;
        case 83: // s key
            velocity2 -= 1;
            if (velocity2 < 1) {
                velocity2 = 1;
            }
            velocitySlider2.value = velocity2;
            applyVelocity();
            setResults(results);
            saveSettings();
            break;
    }
});

loadSettings();

let then = Date.now();
animate();

// initializes all necessary global variables to default values
function init() {
    velocity1 = 12;
    velocity2 = 12;
    started = false;
    results = false;
    inChange = false;
    circsize = 50;
    xpos1 = 0.15*canvas.width+0.05*canvas.width;
    ypos1 = 0.5*canvas.height+0.325*canvas.height;
    xpos2 = 0.55*canvas.width+0.1*canvas.width;
    ypos2 = 0.05*canvas.height+0.675*canvas.height;
    xvel1 = 12;
    yvel1 = -12;
    xvel2 = 12;
    yvel2 = -12;
}

function reset() {
    velocity1 = 12;
    velocitySlider1.value = velocity1;
    velocity2 = 12;
    velocitySlider2.value = velocity2;
    circsize = 50;
    xpos1 = 0.15*canvas.width+0.05*canvas.width;
    ypos1 = 0.5*canvas.height+0.325*canvas.height;
    xpos2 = 0.55*canvas.width+0.1*canvas.width;
    ypos2 = 0.05*canvas.height+0.675*canvas.height;
    xvel1 = 12;
    yvel1 = -12;
    xvel2 = 12;
    yvel2 = -12;
    saveSettings();
}

function loadSettings() {
    // loaded from Session Storage if available
    if (sessionStorage.getItem('settings') != '') {
        var paramList = sessionStorage.getItem('settings').split('&');
        if (paramList.length == 12) {
            FPS = parseInt(paramList[0].split('=')[1]);
            velocity1 = parseInt(paramList[1].split('=')[1]);
            velocitySlider1.value = velocity1;
            velocity2 = parseInt(paramList[2].split('=')[1]);
            velocitySlider2.value = velocity2;
            circsize = parseInt(paramList[3].split('=')[1]);
            xpos1 = parseInt(paramList[4].split('=')[1]);
            ypos1 = parseInt(paramList[5].split('=')[1]);
            xpos2 = parseInt(paramList[6].split('=')[1]);
            ypos2 = parseInt(paramList[7].split('=')[1]);
            xvel1 = parseInt(paramList[8].split('=')[1]);
            yvel1 = parseInt(paramList[9].split('=')[1]);
            xvel2 = parseInt(paramList[10].split('=')[1]);
            yvel2 = parseInt(paramList[11].split('=')[1]);
        }
    }
}

function saveSettings() {
    sessionStorage.setItem('settings', 'fps=' + FPS + '&velocity1=' + velocity1 + '&velocity2=' + velocity2 + '&circsize=' + circsize + '&xpos1=' + xpos1 + '&ypos1=' + ypos1 + '&xpos2=' + xpos2 + '&ypos2=' + ypos2 + '&xvel1=' + xvel1 + '&yvel1=' + yvel1 + '&xvel2=' + xvel2 + '&yvel2=' + yvel2);
}

// logic helper functions

// all drawing (and per frame logic) in here
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultShapeColor();
    ctx.strokeStyle = getDefaultShapeColor();
    
    ctx.fillRect(0.15*canvas.width, 0.5*canvas.height, 0.2*canvas.width, 0.45*canvas.height);
    ctx.fillRect(0.55*canvas.width, 0.05*canvas.height, 0.4*canvas.width, 0.9*canvas.height);
    
    if (started) {
        if (xpos1 < 0.15*canvas.width+circsize/1000*canvas.height) {
            xvel1 = velocity1;
        }
        if (xpos1 > 0.35*canvas.width-circsize/1000*canvas.height) {
            xvel1 = -velocity1;
        }
        if (ypos1 < 0.5*canvas.height+circsize/1000*canvas.height) {
            yvel1 = velocity1;
        }
        if (ypos1 > 0.95*canvas.height-circsize/1000*canvas.height) {
            yvel1 = -velocity1;
        }
        if (xpos2 < 0.55*canvas.width+2*circsize/1000*canvas.height) {
            xvel2 = velocity2;
        }
        if (xpos2 > 0.95*canvas.width-2*circsize/1000*canvas.height) {
            xvel2 = -velocity2;
        }
        if (ypos2 < 0.05*canvas.height+2*circsize/1000*canvas.height) {
            yvel2 = velocity2;
        }
        if (ypos2 > 0.95*canvas.height-2*circsize/1000*canvas.height) {
            yvel2 = -velocity2;
        }
        
        xpos1 += xvel1;
        ypos1 += yvel1;
        xpos2 += xvel2;
        ypos2 += yvel2;
    }
    
    ctx.fillStyle = getDefaultBGColor();
    
    ctx.beginPath();
    ctx.arc(xpos1, ypos1, circsize/1000*canvas.height, 0, 2*Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(xpos2, ypos2, 2*circsize/1000*canvas.height, 0, 2*Math.PI);
    ctx.fill();
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
