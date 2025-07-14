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
    setResults(results);
    saveSettings();
}
velocitySlider1.value = velocity1;

velocitySlider2 = document.getElementById('velocity2');
velocitySlider2.oninput = function() {
    velocity2 = parseInt(this.value);
    setResults(results);
    saveSettings();
}
velocitySlider2.value = velocity2;

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

resultsButton = document.getElementById('results');
resultsButton.onclick = function () {
    toggleResults();
};

function setActiveButton(button) {
    button.classList.add("active-button");
}

// Funktion zum Entfernen des aktiven Status
function removeActiveButton(button) {
    button.classList.remove("active-button");
}

results1 = document.getElementById('results1');
results2 = document.getElementById('results2');

function toggleResults() {
    results = !results;
    if (results) {
        setActiveButton(resultsButton);
    } else {
        removeActiveButton(resultsButton);
    }
    updateResults();
    saveSettings();
}

function updateResults() {
    document.getElementById('results1').textContent = results ? velocity1 : '?';
    document.getElementById('results2').textContent = results ? velocity2 : '?';
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
            velocity1 -= 10;
            if (velocity1 < 1) {
                velocity1 = 1;
            }
            velocitySlider1.value = velocity1;
            setResults(results);
            saveSettings();
            break;
        case 69: // e key
            toggleStarted();
            break;
        case 87: // w key
            velocity2 += 10;
            if (velocity2 > 1000) {
                velocity2 = 1000;
            }
            velocitySlider2.value = velocity2;
            setResults(results);
            saveSettings();
            break;
        case 81: // q key
            velocity1 += 10;
            if (velocity1 > 1000) {
                velocity1 = 1000;
            }
            velocitySlider1.value = velocity1;
            setResults(results);
            saveSettings();
            break;
        case 82: // r key
            toggleResults();
            break;
        case 83: // s key
            velocity2 -= 10;
            if (velocity2 < 1) {
                velocity2 = 1;
            }
            velocitySlider2.value = velocity2;
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
    velocity1 = 200;
    velocity2 = 200;
    started = false;
    results = false;
    inChange = false;
    circsize = 50;
    distance = 150;
    offset1 = 0;
    offset2 = 0;
}

function reset() {
    velocity1 = 200;
    velocitySlider1.value = velocity1;
    velocity2 = 200;
    velocitySlider2.value = velocity2;
    circsize = 50;
    distance = 17;
    offset1 = 0;
    offset2 = 0;
    saveSettings();
}

function loadSettings() {
    // loaded from Session Storage if available
    if (sessionStorage.getItem('settings') != '') {
        var paramList = sessionStorage.getItem('settings').split('&');
        if (paramList.length == 5) {
            FPS = parseInt(paramList[0].split('=')[1]);
            velocity1 = parseInt(paramList[1].split('=')[1]);
            velocitySlider1.value = velocity1;
            velocity2 = parseInt(paramList[2].split('=')[1]);
            velocitySlider2.value = velocity2;
            circsize = parseInt(paramList[3].split('=')[1]);
            distance = parseInt(paramList[4].split('=')[1]);
        }
    }
}

function saveSettings() {
    sessionStorage.setItem('settings', 'fps=' + FPS + '&velocity1=' + velocity1 + '&velocity2=' + velocity2 + '&circsize=' + circsize + '&distance=' + distance);
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
        if (offset1 >= distance/1000*canvas.height) {
            offset1 = 0;
        }
        offset1 += velocity1/FPS;
        if (offset2 >= 2*distance/1000*canvas.height) {
            offset2 = 0;
        }
        offset2 += velocity2/FPS;
    }
    
    ctx.fillStyle = getDefaultBGColor();
    
    for (let i = -distance; i <= 1000+distance; i += distance) {
        ctx.beginPath();
        ctx.arc(0.25*canvas.width, i/1000*canvas.height+offset1, circsize/1000*canvas.height, 0, 2*Math.PI);
        ctx.fill();
    }
    
    for (let i = -2*distance; i <= 1000+2*distance; i += 2*distance) {
        ctx.beginPath();
        ctx.arc(0.75*canvas.width, i/1000*canvas.height+offset2, 2*circsize/1000*canvas.height, 0, 2*Math.PI);
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
