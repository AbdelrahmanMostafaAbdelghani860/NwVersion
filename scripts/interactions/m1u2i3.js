const canvas = document.getElementById('interaction');
const ctx = canvas.getContext('2d');

// functions for accessing css values
function getDefaultShapeColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-shape-color");
}
function getDefaultBGColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-bg-color");
}
function getSecondaryColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-secondary-color");
}
function getTertiaryColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-tertiary-color");
}

// otherwise canvas resolution scales too low
canvas.width = window.innerWidth;
canvas.height = canvas.width/2; // alternatively: = window.innerHeight

crossButtonContainer = document.getElementById('crossButtonContainer');
plusButtonContainer = document.getElementById('plusButtonContainer');
vaseButtonContainer = document.getElementById('vaseButtonContainer');
relativeSizeSliderContainer = document.getElementById('relativeSizeSliderContainer');
vaseDistanceSliderContainer = document.getElementById('vaseDistanceSliderContainer');
resetButtonContainer = document.getElementById('resetButtonContainer');

FPS = 30;
phase = 0;
highlight = 0;
relativeSize = 50;
vaseDistance = 0;

init();

// LOADING RESOURCES

const img_left = new Image();
img_left.src = "../resources/interactions/m1u2i3/m1u2i3_left.png";

const img_right = new Image();
img_right.src = "../resources/interactions/m1u2i3/m1u2i3_right.png";

// SLIDERS & BUTTONS

textfield = document.getElementById('textfield');

crossButton = document.getElementById('cross');
crossButton.onclick = highlight_cross;

function highlight_cross() {
    highlight = 1;
    saveSettings();
}

plusButton = document.getElementById('plus');
plusButton.onclick = highlight_plus;

function highlight_plus() {
    highlight = 2;
    saveSettings();
}

vaseButton = document.getElementById('vase');
vaseButton.onclick = vaseButtonFunction;

function vaseButtonFunction() {
    phase = 1;
    textfield.textContent = languages[localStorage.getItem('lang')]['instructions2'];
    crossButtonContainer.style.setProperty('display', 'none');
    plusButtonContainer.style.setProperty('display', 'none');
    vaseButtonContainer.style.setProperty('display', 'none');
    relativeSizeSliderContainer.style.setProperty('display', 'none');
    vaseDistanceSliderContainer.style.setProperty('display', 'inline-block');
    resetButtonContainer.style.setProperty('display', 'inline-block');
    saveSettings();
}

resetButton = document.getElementById('reset');
resetButton.onclick = resetButtonFunction;

function resetButtonFunction() {
    phase = 0;
    textfield.textContent = languages[localStorage.getItem('lang')]['instructions'];
    highlight = 0;
    relativeSize = 50;
    relativeSizeSlider.value = relativeSize;
    vaseDistance = 0;
    vaseDistanceSlider.value = vaseDistance;
    crossButtonContainer.style.setProperty('display', 'inline-block');
    plusButtonContainer.style.setProperty('display', 'inline-block');
    vaseButtonContainer.style.setProperty('display', 'inline-block');
    relativeSizeSliderContainer.style.setProperty('display', 'inline-block');
    vaseDistanceSliderContainer.style.setProperty('display', 'none');
    resetButtonContainer.style.setProperty('display', 'none');
    saveSettings();
}

relativeSizeSlider = document.getElementById('relativeSize');
relativeSizeSlider.oninput = function() {
    relativeSize = parseInt(this.value);
    highlight = 0;
    saveSettings();
}
relativeSizeSlider.value = relativeSize;

vaseDistanceSlider = document.getElementById('vaseDistance');
vaseDistanceSlider.oninput = function() {
    vaseDistance = parseInt(this.value);
    saveSettings();
}
vaseDistanceSlider.value = vaseDistance;

textfield = document.getElementById('textfield');

// KEY INPUT

window.addEventListener('keydown', function(k) {
    switch (k.keyCode) {
        case 65: // a key
            if (phase == 0) {
                relativeSize -= 1;
                if (relativeSize < 1) {
                    relativeSize = 1;
                }
                relativeSizeSlider.value = relativeSize;
                highlight = 0;
                saveSettings();
            } else {
                vaseDistance -= 1;
                if (vaseDistance < 0) {
                    vaseDistance = 0;
                }
                vaseDistanceSlider.value = vaseDistance;
                saveSettings();
            }
            break;
        case 68: // d key
            if (phase == 0) {
                relativeSize += 1;
                if (relativeSize > 99) {
                    relativeSize = 99;
                }
                relativeSizeSlider.value = relativeSize;
                highlight = 0;
                saveSettings();
            } else {
                vaseDistance += 1;
                if (vaseDistance > 100) {
                    vaseDistance = 100;
                }
                vaseDistanceSlider.value = vaseDistance;
                saveSettings();
            }
            break;
        case 69: // e key
            if (phase == 0) {
                vaseButtonFunction();
            }
            break;
        case 81: // q key
            if (phase == 0) {
                highlight_cross();
            }
            break;
        case 82: // r key
            if (phase == 1) {
                resetButtonFunction();
            }
            break;
        case 87: // w key
            if (phase == 0) {
                highlight_plus();
            }
            break;
    }
});

loadSettings();

let then = Date.now();
animate();

// initializes all necessary global variables to default values
function init() {
    phase = 0;
    highlight = 0;
    relativeSize = 50;
    vaseDistance = 0;
}

function reset() {
    phase = 0;
    highlight = 0;
    relativeSize = 50;
    vaseDistance = 0;
    saveSettings();
}

function loadSettings() {
    // loaded from Session Storage if available
    if (sessionStorage.getItem('settings') != '') {
        var paramList = sessionStorage.getItem('settings').split('&');
        if (paramList.length == 4) {
            FPS = parseInt(paramList[0].split('=')[1]);
            highlight = parseInt(paramList[1].split('=')[1]);
            relativeSize = parseInt(paramList[2].split('=')[1]);
            vaseDistance = parseInt(paramList[3].split('=')[1]);
            saveSettings();
        }
    }
}

function saveSettings() {
    sessionStorage.setItem('settings', 'fps=' + FPS + '&highlight=' + highlight + '&relativeSize=' + relativeSize + '&vaseDistance=' + vaseDistance);
}

// logic helper functions

function draw_fraction_circle(percentile, fraction) { // draws an eight of a circle pointing to the given percentile (starting at the top with 0)
    ctx.beginPath();
    ctx.moveTo(0.5*canvas.width, 0.5*canvas.height);
    ctx.arc(0.5*canvas.width, 0.5*canvas.height, 0.45*canvas.height, 2*percentile*Math.PI-Math.PI/2-fraction*Math.PI/400, 2*percentile*Math.PI-Math.PI/2+fraction*Math.PI/400, false);
    ctx.fill();
}

function draw_first_phase() {
    
    if (highlight == 2) {
        ctx.fillStyle = '#ff0000';
    } else {
        ctx.fillStyle = getTertiaryColor();
    }
    ctx.beginPath();
    ctx.moveTo(0.5*canvas.width, 0.5*canvas.height);
    ctx.arc(0.5*canvas.width, 0.5*canvas.height, 0.45*canvas.height, 0, 2*Math.PI, false);
    ctx.fill();
    
    if (highlight == 1) {
        ctx.fillStyle = '#ff0000';
    } else {
        ctx.fillStyle = getSecondaryColor();
    }
    draw_fraction_circle(0, relativeSize);
    draw_fraction_circle(0.25, relativeSize);
    draw_fraction_circle(0.5, relativeSize);
    draw_fraction_circle(0.75, relativeSize);
}

function draw_second_phase() {
    if (vaseDistance > 0) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(canvas.width/2-vaseDistance*0.003*canvas.width-2, canvas.height*0.091, vaseDistance*0.006*canvas.width+4, canvas.height*0.783);
    }
    ctx.drawImage(img_left, 0-vaseDistance*0.003*canvas.width, 0, canvas.width/2, canvas.height);
    ctx.drawImage(img_right, canvas.width/2+vaseDistance*0.003*canvas.width, 0, canvas.width/2, canvas.height);
}

// all drawing (and per frame logic) in here
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultShapeColor();
    ctx.strokeStyle = getDefaultShapeColor();
    
    switch(phase) {
        case 0:
            draw_first_phase();
            break;
        case 1:
            draw_second_phase();
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
