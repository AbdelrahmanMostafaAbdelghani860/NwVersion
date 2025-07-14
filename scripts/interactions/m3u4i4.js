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

delaySlider = document.getElementById('delay');
delaySlider.oninput = function() {
    delay = parseInt(this.value);
    saveSettings();
}
delaySlider.value = delay;

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
            delay += 10;
            if (delay > 1000) {
                delay = 1000;
            }
            delaySlider.value = delay;
            saveSettings();
            break;
        case 83: // s key
            delay -= 10;
            if (delay < 1) {
                delay = 1;
            }
            delaySlider.value = delay;
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
    delay = 500;
    started = false;
    inChange = false;
    interframeTimer = Date.now();
    carsize = 20;
    speed = 2000;
    extraHeight1 = 0;
    extraHeight2 = 0;
    timer = Date.now();
}

function reset() {
    phase = 0;
    delay = 500;
    delaySlider.value = delay;
    carsize = 20;
    speed = 2000;
    extraHeight1 = 0;
    extraHeight2 = 0;
    timer = Date.now();
    saveSettings();
}

function loadSettings() {
    // loaded from Session Storage if available
    if (sessionStorage.getItem('settings') != '') {
        var paramList = sessionStorage.getItem('settings').split('&');
        if (paramList.length == 4) {
            FPS = parseInt(paramList[0].split('=')[1]);
            delay = parseInt(paramList[1].split('=')[1]);
            delaySlider.value = delay;
            carsize = parseInt(paramList[2].split('=')[1]);
            speed = parseInt(paramList[3].split('=')[1]);
        }
    }
}

function saveSettings() {
    sessionStorage.setItem('settings', 'fps=' + FPS + '&delay=' + delay + '&carsize=' + carsize + '&speed=' + speed);
}

// logic helper functions
function nextPhase() {
    phase = (phase + 1) % 8;
    timer = Date.now();
}

let carImages = [
    new Image(),
    new Image(),
    new Image(),
];

carImages[0].src = '../resources/icon/car1.png';
carImages[1].src = '../resources/icon/car2.png';
carImages[2].src = '../resources/icon/car3.png';

let randomOrder = [0, 1, 2];
randomOrder = randomOrder.sort(()=>Math.random()-0.5);

function getCarImage(index) {
    return carImages[randomOrder[index]];
}

// all drawing (and per frame logic) in here
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //ctx.fillStyle = getDefaultShapeColor();
    //ctx.strokeStyle = getDefaultShapeColor();
    
    if (started) {
        now = Date.now();
        switch (phase) {
            case 0: // no car for like 1 second
                xpos1 = -0.025*carsize*canvas.height;
                xpos2 = -0.025*carsize*canvas.height;
                if (timer + 1000 < Date.now()) {
                    extraHeight1 = Math.floor(Math.random()*50);
                    extraHeight2 = Math.floor(Math.random()*50);
                    nextPhase();
                }
                break;
            case 1: // car 1 arrives
                xpos1 = xpos1 + speed*elapsed/1000;
                if (xpos1 > 0.5*canvas.width) {
                    xpos1 = 0.5*canvas.width;
                    nextPhase();
                }
                break;
            case 2: // car 1 pauses like 1 second
                if (timer + 1000 < Date.now()) {
                    nextPhase();
                }
                break;
            case 3: // car 2 arrives
                xpos2 = xpos2 + speed*elapsed/1000;
                if (xpos2 > 0.5*canvas.width-0.025*carsize*canvas.height) {
                    xpos2 = 0.5*canvas.width-0.025*carsize*canvas.height;
                    nextPhase();
                }
                break;
            case 4: // pause depending on delay
                if (timer + delay < Date.now()) {
                    nextPhase();
                }
                break;
            case 5: // car 1 departure
                xpos1 = xpos1 + speed*elapsed/1000;
                if (xpos1 > canvas.width) {
                    xpos1 = canvas.width;
                    nextPhase();
                }
                break;
            case 6: // car 2 pauses like 1 second
                if (timer + 1000 < Date.now()) {
                    nextPhase();
                }
                break;
            case 7: // car 2 departure
                xpos2 = xpos2 + speed*elapsed/1000;
                if (xpos2 > canvas.width) {
                    xpos2 = canvas.width;
                    nextPhase();
                }
        }
    }

    let car1Image = getCarImage(0);
    let car2Image = getCarImage(1);
    
    
    //ctx.beginPath();
    ctx.drawImage(car1Image, xpos1, canvas.height / 2 - 0.01 * carsize * canvas.height * (0.5 + extraHeight1 / 100), 
                  0.025 * carsize * canvas.height, 0.01 * carsize * canvas.height * (1 + extraHeight1 / 100));
    ctx.drawImage(car2Image, xpos2, canvas.height / 2 - 0.01 * carsize * canvas.height * (0.5 + extraHeight2 / 100), 
                  0.025 * carsize * canvas.height, 0.01 * carsize * canvas.height * (1 + extraHeight2 / 100));
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
