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

resetButtonContainer = document.getElementById('resetButtonContainer');

FPS = 30;
phase = 0;

let textfieldKeys = ['instructions', 'instructions2', 'instructions3'];

init();

// SLIDERS

function nextPhase() {
    setPhase((phase + 1) % 3);
}

function setPhase(newPhase) {
    phase = newPhase;
    textfield.textContent = languages[localStorage.getItem('lang')][textfieldKeys[phase]];
    switch(phase) {
        case 0:
            resetButtonContainer.style.setProperty('display', 'none');
            break;
        case 1:
            resetButtonContainer.style.setProperty('display', 'none');
            break;
        case 2:
            resetButtonContainer.style.setProperty('display', 'none');
            break;
        case 3:
            resetButtonContainer.style.setProperty('display', 'inline');
            break;
    }
    saveSettings();
}

function resetButtonFunction() {
    switch(phase) {
        case 0:
        case 1:
        case 2:
            break;
        case 3:
            setPhase(0);
            break;
    }
    saveSettings();
}

resetButton = document.getElementById('reset');
resetButton.onclick = resetButtonFunction;

textfield = document.getElementById('textfield');

// KEY INPUT

window.addEventListener('keydown', function(k) {
    switch (k.keyCode) {
        case 49: // 1 key
            break;
        case 50: // 2 key
            break;
        case 51: // 3 key
            break;
        case 52: // 4 key
            break;
        case 53: // 5 key
            break;
        case 54: // 6 key
            break;
        case 69: // e key
            switch (phase) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
            }
            break;
        case 82: // r key
            resetButtonFunction();
            break;
    }
});

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {xpos: (event.clientX - rect.left) * scaleX, ypos: (event.clientY - rect.top) * scaleY};
}

function collides_with_rect(cursor, item) {
    return (cursor.xpos > item.xpos && cursor.xpos < item.xpos+item.width && cursor.ypos >= item.ypos && cursor.ypos <= item.ypos+item.height);
}

function collides_with_middle_rect(cursor, item) {
    return (cursor.xpos > item.midX-item.width/2 && cursor.xpos < item.midX+item.width/2 && cursor.ypos >= item.midY-item.height/2 && cursor.ypos <= item.midY+item.height/2);
}

function collides_with_circ(cursor, item) {
    let distance = Math.sqrt((item.midX - cursor.xpos)*(item.midX - cursor.xpos) + (item.midY - cursor.ypos)*(item.midY - cursor.ypos));
    return (-item.rad < distance && distance < item.rad);
}

function collides_with_triangle(cursor, item) {
    return collides_with_circ(cursor, {midX: item.midX, midY: item.midY, rad: item.edges/2});
}

canvas.addEventListener('mousedown', (e) => {
    let cursor = getCursorPosition(canvas, e);
    switch(phase) {
        case 0:
            break;
        case 1:
            break;
        case 2:
            break;
        case 3:
            break;
    }
    saveSettings();
});

canvas.addEventListener('mouseup', (e) => {
    return;
});

canvas.addEventListener('mousemove', (e) => {
    mousepos = getCursorPosition(canvas, e);
});

// main
loadSettings();

let then = Date.now();
animate();

// initializes all necessary global variables to default values
function init() {
    phase = 0;
}

function reset() {
    phase = 0;
    saveSettings();
}

function loadSettings() {
    // loaded from Session Storage if available
    if (sessionStorage.getItem('settings') != '') {
        var paramList = sessionStorage.getItem('settings').split('&');
        if (paramList.length == 2) {
            FPS = parseInt(paramList[0].split('=')[1]);
            phase = parseInt(paramList[1].split('=')[1]);
            saveSettings();
        }
    }
}

function saveSettings() {
    sessionStorage.setItem('settings', 'fps=' + FPS + '&phase=' + phase);
}

// logic helper functions

function draw_triangle(x1, y1, x2, y2, x3, y3) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x1, y1);
    ctx.fill();
}

function draw_triangle_from_middle(midX, midY, line_length) {
    let x1 = midX - line_length/2;
    let y1 = midY + Math.sqrt(line_length*line_length - (line_length/2)*(line_length/2))/2;
    let y3 = y1 - Math.sqrt(line_length*line_length - (line_length/2)*(line_length/2));
    draw_triangle(x1, y1, x1+line_length, y1, midX, y3);
}

function draw_rect_from_middle(midX, midY, width, height) {
    ctx.fillRect(midX-width/2, midY-height/2, width, height);
}

function draw_circ(x, y, rad) {
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, 2*Math.PI);
    ctx.fill();
}

function draw_first_phase() {
    ctx.beginPath();
    ctx.moveTo(0.25*canvas.width, 0.33*canvas.height);
    ctx.lineTo(0.75*canvas.width, 0.33*canvas.height);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0.25*canvas.width, 0.66*canvas.height);
    ctx.lineTo(0.75*canvas.width, 0.66*canvas.height);
    ctx.stroke();
}

function draw_second_phase() {
    return;
}

function draw_third_phase() {
    return;
}

// all drawing (and per frame logic) in here
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultShapeColor();
    ctx.lineWidth = Math.ceil(0.01*canvas.height);
    ctx.strokeStyle = getDefaultShapeColor();
    
    switch(phase) {
        case 0:
            draw_first_phase();
            break;
        case 1:
            draw_second_phase();
            break;
        case 2:
            draw_third_phase();
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
